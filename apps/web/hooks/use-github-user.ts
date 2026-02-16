"use client";

import { useQuery } from "@tanstack/react-query";

export type GithubUserData = {
  id: number;
  name: string;
  blog: string | null;
  location: string | null;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export function useGithubUser(username: string) {
  const getDataFn = async (): Promise<GithubUserData> => {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as GithubUserData;

    return data;
  };

  const githubUserDataQuery = useQuery({
    queryKey: ["contributorProfile", username],
    queryFn: () => getDataFn(),
    enabled: !!username,
  });

  return githubUserDataQuery;
}
