import MemberProposalClient from "./MemberProposalClient";

export default async function MemberProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`http://localhost:3000/api/proposals/${id}`, {
    cache: "no-store",
  });
  const proposal = await res.json();

  return <MemberProposalClient proposal={proposal} />;
}
