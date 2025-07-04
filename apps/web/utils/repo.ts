export const parseRepoPath = (repoPath: string) => {
  const url = new URL(repoPath, "https://github.com");
  const pathSegments = url.pathname.split("/").filter(Boolean);
  if (pathSegments.length < 2) {
    throw new Error("Invalid GitHub URL");
  }
  const owner = pathSegments[0];
  const repo = pathSegments[1];

  return { owner, repo };
};
