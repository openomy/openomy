export interface AntvOscpTask {
  title: string;
  // issueId: string | number;
  issueLink: string;
  repo: string;
  status: "done" | "processing";
  score: number;
}

export interface AntvOscpData {
  name: string;
  avatar: string;
  tasks: AntvOscpTask[];
  score: number;
  // 额外分
  extraScore?: number;
}
