import { notFound } from "next/navigation";
import { PartyDetailPageClient } from "./page-client";

const whitelist = ["antvis/31"];

export default async function PartyDetailPage({
  params,
}: {
  params: Promise<{ owner: string; projectId: string }>;
}) {
  const { owner, projectId } = await params;

  const inWhitelist = whitelist
    .map((item) => item.toLowerCase())
    .includes(`${owner}/${projectId}`.toLowerCase());

  if (!inWhitelist) {
    notFound();
  }

  return <PartyDetailPageClient owner={owner} projectId={projectId} />;
}
