import { PrismaClient } from "@prisma/client";
import { INDIA_STATES_UT, INDIA_DISTRICTS, INDUSTRIAL_CLUSTERS } from "../src/lib/geography/indiaData";
import { DEMO_SKILLS, DEMO_JOBS, DEMO_COURSES, DEMO_COMPANIES, DEMO_CANDIDATE } from "../src/data/demoData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CareerIS Pan-India Deterministic Database Seed...");

  // 1. Create Country
  const country = await prisma.country.upsert({
    where: { code: "IN" },
    update: {},
    create: {
      id: "country-in",
      code: "IN",
      name: "India",
      iso3: "IND",
    },
  });
  console.log(`✓ Country seeded: ${country.name}`);

  // 2. Seed States
  for (const s of INDIA_STATES_UT) {
    await prisma.state.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        isUT: s.isUT,
        isPilotArea: s.isPilotArea || false,
        capital: s.capital,
      },
      create: {
        id: s.id,
        countryId: country.id,
        code: s.code,
        name: s.name,
        isUT: s.isUT,
        isPilotArea: s.isPilotArea || false,
        capital: s.capital,
      },
    });
  }
  console.log(`✓ Seeded ${INDIA_STATES_UT.length} States and Union Territories.`);

  // 3. Seed Key Districts
  for (const d of INDIA_DISTRICTS) {
    await prisma.district.upsert({
      where: { code: d.code },
      update: {
        name: d.name,
        headquarters: d.headquarters,
      },
      create: {
        id: d.id,
        stateId: d.stateId,
        code: d.code,
        name: d.name,
        headquarters: d.headquarters,
      },
    });
  }
  console.log(`✓ Seeded ${INDIA_DISTRICTS.length} Key Industrial Districts.`);

  // 4. Seed Industrial Clusters
  for (const cl of INDUSTRIAL_CLUSTERS) {
    await prisma.industrialCluster.upsert({
      where: { code: cl.code },
      update: {
        name: cl.name,
        sectorFocus: cl.sectorFocus,
        activeUnits: cl.activeUnits,
      },
      create: {
        id: cl.id,
        districtId: cl.districtId,
        code: cl.code,
        name: cl.name,
        sectorFocus: cl.sectorFocus,
        activeUnits: cl.activeUnits,
      },
    });
  }
  console.log(`✓ Seeded ${INDUSTRIAL_CLUSTERS.length} Industrial Manufacturing Clusters.`);

  // 5. Seed Skill Categories & Skills
  const coreCat = await prisma.skillCategory.upsert({
    where: { code: "CAT-TECH-CORE" },
    update: {},
    create: {
      id: "cat-tech-core",
      code: "CAT-TECH-CORE",
      name: "Core Technical Engineering",
    },
  });

  for (const sk of DEMO_SKILLS) {
    await prisma.skill.upsert({
      where: { code: sk.code },
      update: {
        name: sk.name,
        description: sk.description,
        isEmerging: sk.isEmerging,
        isGreenSkill: sk.isGreenSkill,
      },
      create: {
        id: sk.id,
        categoryId: coreCat.id,
        code: sk.code,
        name: sk.name,
        description: sk.description,
        isEmerging: sk.isEmerging,
        isGreenSkill: sk.isGreenSkill,
      },
    });
  }
  console.log(`✓ Seeded ${DEMO_SKILLS.length} Standardized National Competencies.`);

  // 6. Seed Demo Candidate Profile
  const candidateUser = await prisma.user.upsert({
    where: { email: "rohit.sharma@candidate.careeris.in" },
    update: {},
    create: {
      id: "user-cand-01",
      email: "rohit.sharma@candidate.careeris.in",
      fullName: "Rohit Sharma",
      roleType: "CANDIDATE",
      isActive: true,
    },
  });

  await prisma.candidateProfile.upsert({
    where: { userId: candidateUser.id },
    update: {
      headline: DEMO_CANDIDATE.headline,
      summary: DEMO_CANDIDATE.summary,
      currentDistrict: DEMO_CANDIDATE.currentDistrict,
      readinessScore: DEMO_CANDIDATE.readinessScore,
    },
    create: {
      id: DEMO_CANDIDATE.id,
      userId: candidateUser.id,
      headline: DEMO_CANDIDATE.headline,
      summary: DEMO_CANDIDATE.summary,
      currentDistrict: DEMO_CANDIDATE.currentDistrict,
      readinessScore: DEMO_CANDIDATE.readinessScore,
    },
  });
  console.log("✓ Seeded Candidate Dossier & Skill Passport.");

  console.log("🎉 CareerIS Deterministic Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
