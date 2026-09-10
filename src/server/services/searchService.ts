import { prisma } from "@/server/db/prisma";

function roleLabel(role: string) {
  if (role === "EMPLOYER") return "Company";
  if (role === "TRAINING_PROVIDER") return "Training Provider";
  if (role === "DISTRICT_ADMIN" || role === "GOVERNMENT_ADMIN") return "Government / District Planner";
  return "Candidate";
}

export const searchService = {
  async globalSearch(query: string, currentUserId?: string) {
    const q = query.trim();
    if (!q) return { skills: [], jobs: [], courses: [], employers: [], districts: [], clusters: [], accounts: [] };
    const [skills, jobs, courses, accountRows] = await Promise.all([
      prisma.skill.findMany({
        where: { status: "ACTIVE", OR: [{ name: { contains: q, mode: "insensitive" } }, { normalizedName: { contains: q.toLowerCase() } }, { aliases: { some: { normalizedAlias: { contains: q.toLowerCase() }, status: "ACTIVE" } } }] },
        take: 8,
      }),
      prisma.job.findMany({
        where: { status: "ACTIVE", company: { employerAccount: { isNot: null } }, OR: [{ title: { contains: q, mode: "insensitive" } }, { company: { name: { contains: q, mode: "insensitive" } } }, { jobSkills: { some: { skill: { name: { contains: q, mode: "insensitive" } } } } }] },
        take: 8,
        include: { company: { select: { name: true } }, jobSkills: { include: { skill: true } } },
      }),
      prisma.course.findMany({
        where: { status: "ACTIVE", trainingProvider: { account: { isNot: null } }, OR: [{ title: { contains: q, mode: "insensitive" } }, { trainingProvider: { name: { contains: q, mode: "insensitive" } } }, { courseSkills: { some: { skill: { name: { contains: q, mode: "insensitive" } } } } }] },
        take: 8,
        include: { trainingProvider: { select: { name: true } }, courseSkills: { include: { skill: true } } },
      }),
      currentUserId ? prisma.user.findMany({
        where: { isActive: true, id: { not: currentUserId }, OR: [{ fullName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { employerAccount: { is: { companyName: { contains: q, mode: "insensitive" } } } }, { trainingProviderAccount: { is: { organizationName: { contains: q, mode: "insensitive" } } } }, { governmentPlannerProfile: { is: { departmentName: { contains: q, mode: "insensitive" } } } }] },
        take: 10,
        select: { id: true, fullName: true, roleType: true, avatarUrl: true, candidateProfile: { select: { headline: true } }, employerAccount: { select: { companyName: true, industry: true } }, trainingProviderAccount: { select: { organizationName: true, providerType: true } }, governmentPlannerProfile: { select: { departmentName: true, designation: true } } },
      }) : Promise.resolve([]),
    ]);
    const accountIds = accountRows.map((account) => account.id);
    const connections = currentUserId && accountIds.length ? await prisma.connection.findMany({ where: { OR: [{ requesterId: currentUserId, recipientId: { in: accountIds } }, { requesterId: { in: accountIds }, recipientId: currentUserId }] } }) : [];
    const accounts = accountRows.map((account) => {
      const connection = connections.find((row) => row.requesterId === account.id || row.recipientId === account.id);
      const displayName = account.employerAccount?.companyName || account.trainingProviderAccount?.organizationName || account.governmentPlannerProfile?.departmentName || account.fullName;
      return { id: account.id, displayName, personName: displayName === account.fullName ? null : account.fullName, roleLabel: roleLabel(account.roleType), subtitle: account.candidateProfile?.headline || account.employerAccount?.industry || account.trainingProviderAccount?.providerType || account.governmentPlannerProfile?.designation || "Registered CAREERIS account", avatarUrl: account.avatarUrl, connectionStatus: connection?.status === "ACCEPTED" ? "CONNECTED" : connection?.requesterId === currentUserId ? "REQUEST_SENT" : connection?.recipientId === currentUserId ? "REQUEST_RECEIVED" : "NONE", connectionId: connection?.id || null };
    });
    return { skills, jobs, courses, employers: accounts.filter((account) => account.roleLabel === "Company"), districts: [], clusters: [], accounts };
  },
};
