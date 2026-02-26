import MemberProposalClient from "./MemberProposalClient";
import { prisma } from "@/app/lib/prisma";

export default async function MemberProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id: Number(id) },
    include: {
      reservation: {
        include: { member: true },
      },
      items: true,
      sentEmails: true,
    },
  });

  if (!proposal) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="font-lora text-lg text-[#666666]">Proposal not found.</p>
        </div>
      </div>
    );
  }

  const serializedProposal = JSON.parse(JSON.stringify(proposal));

  return <MemberProposalClient proposal={serializedProposal} />;
}
