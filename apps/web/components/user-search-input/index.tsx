"use client";

import { useState, useMemo } from "react";
import { AutoComplete, type Option } from "@/components/autocomplete";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import { cn } from "@/lib/utils";

export interface UserSearchInputProps {
  owner: string;
  repo: string;
  onChange?: (userName: string | undefined) => void;
}

export function UserSearchInput({
  owner,
  repo,
  onChange,
}: UserSearchInputProps) {
  const [name, setName] = useState<string>("a");
  const [value, setValue] = useState<Option | undefined>();

  const getDataFn = async () => {
    const searchParams = new URLSearchParams({
      owner,
      repo,
      name: name || "a",
    });

    return await (
      await fetch(`/api/search/contributors?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
  };

  const dataQuery = useQuery<{ data: string[] }>({
    queryKey: ["data", owner, repo, name],
    queryFn: () => getDataFn(),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
    enabled: !!name,
  });

  const list = useMemo(() => {
    return (dataQuery.data?.data || []).map((item) => ({
      label: item,
      value: item,
    }));
  }, [dataQuery.data]);

  const handleValueChange = (option: Option | undefined) => {
    onChange?.(option?.value);
    setValue(option);
  };

  return (
    <AutoComplete
      options={list}
      emptyMessage="No results."
      placeholder="Search contributor"
      onValueChange={handleValueChange}
      // isLoading={dataQuery.isLoading}
      value={value}
      onSearchValueChange={(val) => setName(val || "a")}
    />
  );
}
