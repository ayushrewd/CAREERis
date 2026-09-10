import pkg from "@prisma/client";
const { PrismaClient, ProficiencyLevel, EntityStatus, JobType, UserRoleType } = pkg;

const prisma = new PrismaClient();

const CANONICAL_SKILLS_TO_SEED = [
  { code: "SKILL-AI-01", name: "Artificial Intelligence", normalizedName: "artificial intelligence" },
  { code: "SKILL-ML-01", name: "Machine Learning", normalizedName: "machine learning" },
  { code: "SKILL-DL-01", name: "Deep Learning", normalizedName: "deep learning" },
  { code: "SKILL-PY-01", name: "Python", normalizedName: "python" },
  { code: "SKILL-DE-01", name: "Data Engineering", normalizedName: "data engineering" },
  { code: "SKILL-ME-01", name: "Model Evaluation", normalizedName: "model evaluation" },
  { code: "SKILL-NLP-01", name: "Natural Language Processing", normalizedName: "natural language processing" },
  { code: "SKILL-CV-01", name: "Computer Vision", normalizedName: "computer vision" },
  { code: "SKILL-PBI-01", name: "Power BI", normalizedName: "power bi" },
  { code: "SKILL-SQL-01", name: "SQL", normalizedName: "sql" },
  { code: "SKILL-BMS-01", name: "Battery Management Systems (BMS)", normalizedName: "battery management systems (bms)" },
  { code: "SKILL-CAN-01", name: "CAN Bus Communication", normalizedName: "can bus communication" },
  { code: "SKILL-HV-01", name: "High-Voltage Safety Norms (ISO 6469 / AIS 038)", normalizedName: "high-voltage safety norms (iso 6469 / ais 038)" },
  { code: "SKILL-EV-01", name: "EV Powertrain Diagnostics", normalizedName: "ev powertrain diagnostics" },
  { code: "SKILL-PLC-01", name: "Programmable Logic Controllers (PLC)", normalizedName: "programmable logic controllers (plc)" },
  { code: "SKILL-SCADA-01", name: "SCADA Systems", normalizedName: "scada systems" },
  { code: "SKILL-ROS-01", name: "Industrial Robotics (ROS 2)", normalizedName: "industrial robotics (ros 2)" },
  { code: "SKILL-TS-01", name: "TypeScript", normalizedName: "typescript" },
  { code: "SKILL-REACT-01", name: "React", normalizedName: "react" },
];

export async function seedCanonicalJobs() {
  console.log("[seedCanonicalJobs] Checking database state...");

  // 1. Ensure Skill Category & Skills
  const category = await prisma.skillCategory.upsert({
    where: { code: "CAT-TECH" },
    update: {},
    create: { code: "CAT-TECH", name: "Technical Core" },
  });

  const skillMap = new Map();
  for (const item of CANONICAL_SKILLS_TO_SEED) {
    const skill = await prisma.skill.upsert({
      where: { code: item.code },
      update: { name: item.name, normalizedName: item.normalizedName, canonicalName: item.name },
      create: {
        code: item.code,
        name: item.name,
        canonicalName: item.name,
        normalizedName: item.normalizedName,
        categoryId: category.id,
        status: EntityStatus.ACTIVE,
      },
    });
    skillMap.set(item.normalizedName, skill.id);
  }
  console.log(`[seedCanonicalJobs] Synchronized ${skillMap.size} canonical skills.`);

  // 2. Ensure Companies & Employer Accounts
  let dnaCompany = await prisma.company.findFirst({
    where: { name: "DNA", employerAccount: { isNot: null } },
    include: { employerAccount: true },
  });
  if (!dnaCompany) {
    const existingAccount = await prisma.employerAccountProfile.findFirst({ include: { company: true } });
    if (existingAccount?.company) {
      dnaCompany = existingAccount.company;
    } else {
      const dnaUser = await prisma.user.upsert({
        where: { email: "employer-dna@careeris.in" },
        update: {},
        create: {
          email: "employer-dna@careeris.in",
          fullName: "DNA Talent Acquisition",
          roleType: UserRoleType.EMPLOYER,
        },
      });
      dnaCompany = await prisma.company.create({
        data: {
          name: "DNA",
          legalName: "DNA Technologies Pvt Ltd",
          headquarters: "New Delhi",
          isVerified: true,
          employerAccount: {
            create: {
              userId: dnaUser.id,
              companyName: "DNA",
              designation: "Head of Talent",
              industry: "Technology",
              canPostJobs: true,
            },
          },
        },
        include: { employerAccount: true },
      });
    }
  }

  let tataCompany = await prisma.company.findFirst({
    where: { name: "Tata Motors EV Division", employerAccount: { isNot: null } },
    include: { employerAccount: true },
  });
  if (!tataCompany) {
    const tataUser = await prisma.user.upsert({
      where: { email: "employer-tata@careeris.in" },
      update: {},
      create: {
        email: "employer-tata@careeris.in",
        fullName: "Tata Motors EV Talent Team",
        roleType: UserRoleType.EMPLOYER,
      },
    });
    tataCompany = await prisma.company.create({
      data: {
        name: "Tata Motors EV Division",
        legalName: "Tata Passenger Electric Mobility Limited",
        headquarters: "Pune & Mumbai",
        isVerified: true,
        employerAccount: {
          create: {
            userId: tataUser.id,
            companyName: "Tata Motors EV Division",
            designation: "Lead Recruiter - High Voltage Systems",
            industry: "Automotive & Electric Vehicles",
            canPostJobs: true,
          },
        },
      },
      include: { employerAccount: true },
    });
  }

  let infosysCompany = await prisma.company.findFirst({
    where: { name: "Infosys Engineering Services", employerAccount: { isNot: null } },
    include: { employerAccount: true },
  });
  if (!infosysCompany) {
    const infUser = await prisma.user.upsert({
      where: { email: "employer-infosys@careeris.in" },
      update: {},
      create: {
        email: "employer-infosys@careeris.in",
        fullName: "Infosys Campus & Tech Hiring",
        roleType: UserRoleType.EMPLOYER,
      },
    });
    infosysCompany = await prisma.company.create({
      data: {
        name: "Infosys Engineering Services",
        legalName: "Infosys Limited",
        headquarters: "Bengaluru & Pune",
        isVerified: true,
        employerAccount: {
          create: {
            userId: infUser.id,
            companyName: "Infosys Engineering Services",
            designation: "Senior Talent Partner - Applied AI Practice",
            industry: "IT & Digital Technologies",
            canPostJobs: true,
          },
        },
      },
      include: { employerAccount: true },
    });
  }

  let bfCompany = await prisma.company.findFirst({
    where: { name: "Bharat Forge Ltd", employerAccount: { isNot: null } },
    include: { employerAccount: true },
  });
  if (!bfCompany) {
    const bfUser = await prisma.user.upsert({
      where: { email: "employer-bf@careeris.in" },
      update: {},
      create: {
        email: "employer-bf@careeris.in",
        fullName: "Bharat Forge Talent Acquisition",
        roleType: UserRoleType.EMPLOYER,
      },
    });
    bfCompany = await prisma.company.create({
      data: {
        name: "Bharat Forge Ltd",
        legalName: "Bharat Forge Limited",
        headquarters: "Pune",
        isVerified: true,
        employerAccount: {
          create: {
            userId: bfUser.id,
            companyName: "Bharat Forge Ltd",
            designation: "Head of Robotics & Precision Engineering Recruitment",
            industry: "Advanced Manufacturing",
            canPostJobs: true,
          },
        },
      },
      include: { employerAccount: true },
    });
  }

  console.log("[seedCanonicalJobs] Verified employer companies: DNA, Tata Motors, Infosys, Bharat Forge.");

  // 3. Define the Evidence Roles and Postings
  const jobSpecs = [
    // 1. AI/ML Engineer at DNA
    {
      companyId: dnaCompany.id,
      title: "AI/ML Engineer",
      sectorText: "IT & Digital Technologies",
      locationText: "Delhi / Bengaluru (Hybrid)",
      description: "Design, build, and deploy production machine learning and generative AI systems, deep learning models, LLM pipelines, and computer vision / NLP workflows.",
      qualification: "B.Tech / M.Tech in Computer Science / AI / Data Science",
      minExperience: 1,
      maxExperience: 5,
      minSalaryINR: 900000,
      maxSalaryINR: 1800000,
      requirements: [
        { name: "Artificial Intelligence", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Machine Learning", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Deep Learning", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Python", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Data Engineering", proficiency: ProficiencyLevel.INTERMEDIATE },
        { name: "Model Evaluation", proficiency: ProficiencyLevel.ADVANCED },
      ],
    },
    // 2. AI/ML Engineer at Infosys Engineering Services
    {
      companyId: infosysCompany.id,
      title: "AI/ML Engineer",
      sectorText: "IT & Digital Technologies",
      locationText: "Pune Hinjawadi / Bengaluru",
      description: "Enterprise LLM, Computer Vision, and Applied Machine Learning engineering across cloud microservices and scalable inference pipelines.",
      qualification: "B.E. / B.Tech / MCA in Computer Engineering or related field",
      minExperience: 2,
      maxExperience: 6,
      minSalaryINR: 1000000,
      maxSalaryINR: 2000000,
      requirements: [
        { name: "Artificial Intelligence", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Machine Learning", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Deep Learning", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Python", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Computer Vision", proficiency: ProficiencyLevel.INTERMEDIATE },
        { name: "Natural Language Processing", proficiency: ProficiencyLevel.INTERMEDIATE },
      ],
    },
    // 3. Data Analyst & BI Specialist at DNA
    {
      companyId: dnaCompany.id,
      title: "Data Analyst & BI Specialist",
      sectorText: "IT & Digital Technologies",
      locationText: "Delhi / Remote",
      description: "Enterprise database querying, statistical modelling, and executive dashboards in Power BI and Python.",
      qualification: "Bachelor's degree in Statistics, Mathematics, Computer Science, or Economics",
      minExperience: 1,
      maxExperience: 4,
      minSalaryINR: 650000,
      maxSalaryINR: 1200000,
      requirements: [
        { name: "Power BI", proficiency: ProficiencyLevel.ADVANCED },
        { name: "SQL", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Python", proficiency: ProficiencyLevel.ADVANCED },
      ],
    },
    // 4. Battery Management System (BMS) Calibration Specialist at Tata Motors
    {
      companyId: tataCompany.id,
      title: "Battery Management System (BMS) Calibration Specialist",
      sectorText: "Automotive & EV",
      locationText: "Pune Pimpri & Chakan EV Mega Plant",
      description: "Lead engineer responsible for high-voltage battery pack state-of-charge calibration, thermal safety, and vehicle CAN telemetry integration.",
      qualification: "Diploma / Degree in Electrical, Electronics, or Mechatronics Engineering",
      minExperience: 2,
      maxExperience: 6,
      minSalaryINR: 750000,
      maxSalaryINR: 1350000,
      requirements: [
        { name: "Battery Management Systems (BMS)", proficiency: ProficiencyLevel.ADVANCED },
        { name: "CAN Bus Communication", proficiency: ProficiencyLevel.ADVANCED },
        { name: "High-Voltage Safety Norms (ISO 6469 / AIS 038)", proficiency: ProficiencyLevel.ADVANCED },
        { name: "EV Powertrain Diagnostics", proficiency: ProficiencyLevel.INTERMEDIATE },
      ],
    },
    // 5. Industrial Automation & PLC Specialist at Bharat Forge Ltd
    {
      companyId: bfCompany.id,
      title: "Industrial Automation & PLC Specialist",
      sectorText: "Advanced Manufacturing",
      locationText: "Pune Mundhwa Centre of Excellence",
      description: "Automation engineer designing ladder logic, integrating SCADA systems, and configuring automated manufacturing lines.",
      qualification: "Diploma / B.E. in Instrumentation, Mechatronics, or Electrical Engineering",
      minExperience: 2,
      maxExperience: 6,
      minSalaryINR: 700000,
      maxSalaryINR: 1300000,
      requirements: [
        { name: "Programmable Logic Controllers (PLC)", proficiency: ProficiencyLevel.ADVANCED },
        { name: "SCADA Systems", proficiency: ProficiencyLevel.INTERMEDIATE },
        { name: "Industrial Robotics (ROS 2)", proficiency: ProficiencyLevel.INTERMEDIATE },
      ],
    },
    // 6. Autonomous Robotics (ROS 2) Engineer at Bharat Forge Ltd
    {
      companyId: bfCompany.id,
      title: "Autonomous Robotics (ROS 2) Engineer",
      sectorText: "Advanced Manufacturing",
      locationText: "Pune Mundhwa",
      description: "Developer responsible for ROS 2 node architecture, industrial manipulators, kinematic simulation, and robot cell commissioning.",
      qualification: "B.Tech in Robotics, Mechatronics, or Computer Science",
      minExperience: 2,
      maxExperience: 5,
      minSalaryINR: 850000,
      maxSalaryINR: 1500000,
      requirements: [
        { name: "Industrial Robotics (ROS 2)", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Python", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Computer Vision", proficiency: ProficiencyLevel.INTERMEDIATE },
      ],
    },
    // 7. Full Stack Web & Cloud Developer at DNA
    {
      companyId: dnaCompany.id,
      title: "Full Stack Web & Cloud Developer",
      sectorText: "IT & Digital Technologies",
      locationText: "Delhi / Bengaluru",
      description: "Full-stack application development, distributed systems, microservices architecture, and modern web applications.",
      qualification: "B.Tech / B.E. / BCA / MCA in Computer Science",
      minExperience: 1,
      maxExperience: 4,
      minSalaryINR: 700000,
      maxSalaryINR: 1400000,
      requirements: [
        { name: "TypeScript", proficiency: ProficiencyLevel.ADVANCED },
        { name: "React", proficiency: ProficiencyLevel.ADVANCED },
        { name: "Python", proficiency: ProficiencyLevel.INTERMEDIATE },
        { name: "SQL", proficiency: ProficiencyLevel.ADVANCED },
      ],
    },
  ];

  for (const spec of jobSpecs) {
    const existing = await prisma.job.findFirst({
      where: { companyId: spec.companyId, title: spec.title, status: EntityStatus.ACTIVE },
    });

    if (!existing) {
      await prisma.job.create({
        data: {
          companyId: spec.companyId,
          title: spec.title,
          sectorText: spec.sectorText,
          locationText: spec.locationText,
          description: spec.description,
          qualification: spec.qualification,
          jobType: JobType.FULL_TIME,
          minExperience: spec.minExperience,
          maxExperience: spec.maxExperience,
          minSalaryINR: spec.minSalaryINR,
          maxSalaryINR: spec.maxSalaryINR,
          openPositions: 4,
          status: EntityStatus.ACTIVE,
          declaredRequirements: {
            create: spec.requirements.map((req) => ({
              name: req.name,
              normalizedName: req.name.toLowerCase().trim(),
              proficiency: req.proficiency,
              isMandatory: true,
            })),
          },
        },
      });
      console.log(`[seedCanonicalJobs] Created active job: "${spec.title}"`);
    }
  }

  // 4. Ensure Training Provider and Verified Courses
  let provider = await prisma.trainingProvider.findFirst({
    where: { code: "TP-NIT-01" },
    include: { account: true },
  });
  if (!provider) {
    const tpUser = await prisma.user.upsert({
      where: { email: "provider-nsti@careeris.in" },
      update: {},
      create: {
        email: "provider-nsti@careeris.in",
        fullName: "National Institute of Advanced Technology",
        roleType: UserRoleType.TRAINING_PROVIDER,
      },
    });
    provider = await prisma.trainingProvider.create({
      data: {
        code: "TP-NIT-01",
        name: "National Institute of Advanced Technology & AI Systems",
        providerType: "NSTI",
        headquarters: "Bengaluru & Pune",
        isAccredited: true,
        account: {
          create: {
            userId: tpUser.id,
            organizationName: "National Institute of Advanced Technology & AI Systems",
            providerType: "NSTI",
            headquarters: "Bengaluru & Pune",
          },
        },
      },
      include: { account: true },
    });
  }

  const courseSpecs = [
    {
      code: "CRS-AI-DL-01",
      title: "Mastering Deep Learning, LLMs & Applied AI Systems",
      description: "Hands-on engineering curriculum covering PyTorch, neural networks, transformers, model evaluation, and production deployment.",
      durationHours: 120,
      level: ProficiencyLevel.ADVANCED,
      skills: ["artificial intelligence", "machine learning", "deep learning", "python"],
    },
    {
      code: "CRS-BI-01",
      title: "Power BI & Enterprise Analytics Masterclass",
      description: "Comprehensive DAX, data modeling, SQL queries, and interactive reporting for enterprise business intelligence.",
      durationHours: 80,
      level: ProficiencyLevel.ADVANCED,
      skills: ["power bi", "sql"],
    },
    {
      code: "CRS-EV-BMS-01",
      title: "EV Battery Management & High-Voltage Systems Calibration",
      description: "Hands-on hardware-in-the-loop (HIL) calibration, CAN bus telemetry, and AIS 038 battery safety certification.",
      durationHours: 100,
      level: ProficiencyLevel.ADVANCED,
      skills: ["battery management systems (bms)", "can bus communication", "high-voltage safety norms (iso 6469 / ais 038)"],
    },
    {
      code: "CRS-PLC-01",
      title: "Siemens & Rockwell Industrial PLC Programming and SCADA",
      description: "Ladder logic design, industrial networking, SCADA interfaces, and robotic cell integration.",
      durationHours: 90,
      level: ProficiencyLevel.ADVANCED,
      skills: ["programmable logic controllers (plc)", "scada systems"],
    },
    {
      code: "CRS-ROS-01",
      title: "ROS 2 Autonomous Robotics Architecture & Simulation",
      description: "Node lifecycle, pub-sub messaging, sensor fusion, OpenCV vision pipelines, and Gazebo kinematics simulation.",
      durationHours: 110,
      level: ProficiencyLevel.ADVANCED,
      skills: ["industrial robotics (ros 2)", "python", "computer vision"],
    },
  ];

  for (const spec of courseSpecs) {
    const existingCourse = await prisma.course.findUnique({ where: { code: spec.code } });
    if (!existingCourse) {
      const course = await prisma.course.create({
        data: {
          trainingProviderId: provider.id,
          code: spec.code,
          title: spec.title,
          description: spec.description,
          durationHours: spec.durationHours,
          level: spec.level,
          deliveryMode: "HYBRID",
          locationText: "Bengaluru / Online Lab",
          status: EntityStatus.ACTIVE,
          healthScore: 94.0,
        },
      });

      for (const skillKey of spec.skills) {
        const sId = skillMap.get(skillKey);
        if (sId) {
          await prisma.courseSkill.upsert({
            where: { courseId_skillId: { courseId: course.id, skillId: sId } },
            update: {},
            create: {
              courseId: course.id,
              skillId: sId,
              targetLevel: spec.level,
              curriculumWeight: 1.0,
            },
          });
        }
      }
      console.log(`[seedCanonicalJobs] Created verified course: "${spec.title}"`);
    }
  }

  const totalNow = await prisma.job.count({
    where: { status: EntityStatus.ACTIVE, company: { employerAccount: { isNot: null } } },
  });

  console.log(`[seedCanonicalJobs] Seeding complete. Total active registered jobs: ${totalNow}`);
  return totalNow;
}

if (process.argv[1]?.endsWith("seed-canonical-jobs.mjs")) {
  seedCanonicalJobs()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
