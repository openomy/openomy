"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export type GithubRepoData = {
  id: number;
  name: string;
  forks: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  archived: boolean;
  stargazers_count: number;
  formatted_star_count: string;
};

// Format number with one decimal place and unit suffix (k, M)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

export function useGithubRepo(repoPath: string) {
  const [mounted, setMounted] = useState(false);

  const getDataFn = async (): Promise<GithubRepoData> => {
    const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as GithubRepoData;

    return {
      ...data,
      formatted_star_count: formatNumber(data.stargazers_count),
    };
  };

  const githubRepoDataQuery = useQuery({
    queryKey: ["githubRepo", repoPath, mounted],
    queryFn: () => getDataFn(),
    enabled: !!repoPath && mounted,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  return githubRepoDataQuery;
}
