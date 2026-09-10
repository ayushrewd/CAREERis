// ==============================================================================
// CAREERIS GLOBAL AI ASSISTANT SERVICE
// Exhaustive knowledge engine for the CareerIS platform, SIH26134, and user navigation
// ==============================================================================

export interface AIAssistantMessage {
  role: "user" | "assistant" | "system";
  content: string;
  links?: { label: string; url: string; icon?: string }[];
  category?: string;
  suggestedPrompts?: string[];
}

export interface AIAssistantResponse {
  answer: string;
  links: { label: string; url: string; icon?: string }[];
  category: string;
  suggestedPrompts: string[];
}

class GlobalAIAssistantService {
  async processQuery(query: string, currentPath?: string, userRole?: string): Promise<AIAssistantResponse> {
    const q = query.toLowerCase().trim();

    // 1. SIH Problem Statement / Government of Maharashtra
    if (
      q.includes("sih") ||
      q.includes("problem statement") ||
      q.includes("sih26134") ||
      q.includes("maharashtra") ||
      q.includes("hackathon")
    ) {
      return {
        answer: `### 🏛️ SIH Problem Statement: SIH26134
**Title:** *Challenges in aligning skill development programs with industry requirements and emerging job market*
**Organization:** **Government of Maharashtra** (Higher & Technical Education / Skill Development Dept)

**How CareerIS Solves This Problem:**
1. **Curriculum Alignment Audit:** Ingests live job requisitions and computes course alignment health (e.g. 52% alignment in AI/ML), recommending concrete updates (e.g., adding MLOps & GenAI).
2. **Trainer Capacity (ToT):** Identifies faculty gaps (e.g., needing 40 MLOps trainers with only 17 available) and produces upskilling + hiring plans.
3. **Lab Equipment Readiness:** Tracks physical labs (e.g., 20 GPU rigs required vs 8 available) and generates infrastructure capex budgets (₹5.6 Cr).
4. **District-Wise Planning:** Custom strategies for **Pune** (Adv AI/EV), **Nagpur** (Employability/Scale), and **Gadchiroli** (Local Priority Sectors).
5. **Closed-Loop Feedback:** Post-hiring employer reviews feed directly back into government curriculum modernization.`,
        links: [
          { label: "Government Command Center", url: "/government" },
          { label: "District Admin (Pune Pilot)", url: "/district-admin" },
          { label: "Curriculum Alignment", url: "/training-provider/curriculum" },
          { label: "Platform Manifesto", url: "/about" },
        ],
        category: "SIH & Government Policy",
        suggestedPrompts: [
          "Explain the 23-step Live Learning Loop",
          "How does District Planning work for Pune vs Nagpur?",
          "How does ITI curriculum audit work?",
        ],
      };
    }

    // 2. The Comic Story / Nilesh Purvey
    if (
      q.includes("nilesh") ||
      q.includes("purvey") ||
      q.includes("story") ||
      q.includes("comic") ||
      q.includes("pdf") ||
      q.includes("character")
    ) {
      return {
        answer: `### 📖 The Story of Nilesh Purvey (The CareerIS Hero Journey)
**Nilesh Purvey** is a 20-year-old IT fresher from Greater Noida (GBU graduate) aiming to become an **AI Developer** in a top MNC.

**His Complete Journey in CareerIS:**
1. **Onboarding & Skill Passport:** Creates profile $\\rightarrow$ skills verified via proctored assessments instead of keyword CVs.
2. **Skill Gap Analysis:** Attempts to apply for an AI Developer role; CareerIS halts blind apply and shows an **Explainable Match Score of 67%** with specific gaps (Deep Learning, MLOps, Docker, AWS).
3. **Personalized Roadmap:** CareerIS provides a custom milestone roadmap and smart course recommendations.
4. **Project Evidence:** Nilesh builds an *AI Customer Support Agent (LLM + RAG + Docker + AWS)*. The system evaluates and scores it **89/100**.
5. **Match Score Jumps to 91%:** With verified project proof, his match climbs from **67% $\\rightarrow$ 91%**.
6. **MNC Shortlist & Hiring:** Recruiter selects him based on verified proof rather than resume claims.
7. **The Closed Loop:** His employer's 6-month feedback reveals candidates need more Production MLOps experience, which CareerIS feeds back to update government and ITI curricula!`,
        links: [
          { label: "Candidate Dashboard", url: "/candidate" },
          { label: "Skill Passport", url: "/candidate/skill-passport" },
          { label: "Career Paths & Roadmap", url: "/career-paths" },
          { label: "Verified Projects", url: "/candidate/projects" },
        ],
        category: "User Story & Persona",
        suggestedPrompts: [
          "Why did Nilesh's match score increase from 67% to 91%?",
          "How does the Employer Shortlist work?",
          "What is the closed feedback loop?",
        ],
      };
    }

    // 3. 23-Step Live Learning Loop
    if (
      q.includes("loop") ||
      q.includes("23 step") ||
      q.includes("closed loop") ||
      q.includes("feedback loop") ||
      q.includes("how it works")
    ) {
      return {
        answer: `### 🔄 The 23-Step Live Learning Closed Loop
CareerIS unites individual jobseekers, vocational institutes, and government policy in one perpetual self-improving loop:

\`\`\`
1. Industry Demands ➔ 2. Live Job Postings ➔ 3. Required Competencies ➔ 
4. MahaSkill Intelligence Engine ➔ 5. Skill Gap Analysis ➔ 6. Course Recommendation ➔ 
7. Curriculum Alignment Update ➔ 8. Trainer (ToT) Capacity ➔ 9. Lab Equipment Readiness ➔ 
10. Candidate Trains ➔ 11. Hands-on Project ➔ 12. Skill Passport Verification ➔ 
13. Explainable Match (67% ➔ 91%) ➔ 14. MNC Placement ➔ 15. Employer Performance Feedback ➔ 
16. New Industry Gap Discovery ➔ 17. ITI Syllabus Modernization (Continuous Cycle)
\`\`\`

**Why this is revolutionary:** Unlike LinkedIn or job portals that stop at hiring, CareerIS uses employer feedback to upgrade what students are taught tomorrow!`,
        links: [
          { label: "Market Intelligence", url: "/insights" },
          { label: "Curriculum Health", url: "/training-provider/course-health" },
          { label: "Employer Feedback System", url: "/employer/feedback" },
          { label: "Predictive Copilot", url: "/copilot" },
        ],
        category: "Platform Architecture",
        suggestedPrompts: [
          "How does ITI curriculum audit work?",
          "What is the Skill Passport?",
          "Show me Government District Planning",
        ],
      };
    }

    // 4. Candidate Portal / Skill Passport / Explainable Match
    if (
      q.includes("candidate") ||
      q.includes("passport") ||
      q.includes("skill passport") ||
      q.includes("explainable") ||
      q.includes("readiness") ||
      q.includes("roadmap")
    ) {
      return {
        answer: `### 🎓 Candidate Operating System & Skill Passport
The Candidate experience in CareerIS is designed around **Evidence over Claims**:

* **Skill Passport (\`/candidate/skill-passport\`):** Displays verified competencies with tamper-evident evidence badges, proctored test results, and GitHub/project links.
* **Explainable Matching (\`/jobs\`):** Instead of a black-box percentage, candidates see **Match Breakdowns** (e.g. 67% vs 91%) with explicit reasons (Green = Matched, Yellow = Partial, Red = Gap).
* **AI Action Plan & Roadmap (\`/career-paths\`):** Structured step-by-step milestones to close exact missing skills.
* **Project Verification (\`/candidate/projects\`):** Automated code & architecture evaluation that converts capstone projects into verified proof.`,
        links: [
          { label: "Candidate Command Center", url: "/candidate" },
          { label: "Skill Passport", url: "/candidate/skill-passport" },
          { label: "Explore Jobs & Matches", url: "/jobs" },
          { label: "Career Trajectory", url: "/candidate/trajectory" },
        ],
        category: "Candidate Features",
        suggestedPrompts: [
          "How do assessments verify skills?",
          "Tell me about Nilesh's RAG project",
          "How does Employer view candidate proof?",
        ],
      };
    }

    // 5. Training Provider / ITI / Curriculum / Equipment / Trainers
    if (
      q.includes("iti") ||
      q.includes("training") ||
      q.includes("curriculum") ||
      q.includes("equipment") ||
      q.includes("lab") ||
      q.includes("trainer") ||
      q.includes("tot")
    ) {
      return {
        answer: `### 🏫 Vocational & ITI Modernization Engine
CareerIS gives ITIs, Polytechnics, and Vocational Colleges the intelligence tools needed to maintain 100% industry relevance:

* **Curriculum Health Audit (\`/training-provider/curriculum\`):** Automatically evaluates course syllabus against active job market requisitions and scores alignment (e.g. 52% alignment in legacy AI courses).
* **Trainer (ToT) Gap Matrix (\`/training-provider/trainers\`):** Tracks certified faculty count, identifies trainer shortages (e.g., 23 MLOps trainers deficit), and plans upskilling cohorts.
* **Lab Equipment Readiness (\`/training-provider/equipment\`):** Tracks physical equipment (e.g. GPU servers, EV diagnostic benches, PLC simulation rigs) and models the budget required for upgrades.
* **Course Modernization (\`/training-provider/course-health\`):** Flags obsolete topics (e.g., manual draughtsmanship) and recommends high-growth replacements (e.g., 5-Axis CNC / Robotic welding).`,
        links: [
          { label: "Training Provider Hub", url: "/training-provider" },
          { label: "Curriculum Alignment", url: "/training-provider/curriculum" },
          { label: "Lab Equipment Tracker", url: "/training-provider/equipment" },
          { label: "Trainer Capacity", url: "/training-provider/trainers" },
        ],
        category: "Vocational & ITIs",
        suggestedPrompts: [
          "How is lab equipment verified?",
          "What is the ₹5.6 Cr infrastructure budget plan?",
          "How does District Admin use ITI data?",
        ],
      };
    }

    // 6. Government & District Planning
    if (
      q.includes("government") ||
      q.includes("district") ||
      q.includes("dsdo") ||
      q.includes("pune") ||
      q.includes("nagpur") ||
      q.includes("gadchiroli") ||
      q.includes("policy") ||
      q.includes("budget")
    ) {
      return {
        answer: `### 🏛️ Government Command Center & District Planning
State skill missions and District Skill Development Officers (DSDOs) use CareerIS for data-driven workforce planning:

* **Pan-India Geographic Matrix (\`/government/india\`):** Multi-tier coverage across all 28 States & 8 UTs.
* **District Differentiation (\`/district-admin\`):**
  * **Pune Division:** High-tech EV & AI Opportunity Hotspot (Advanced AI, BMS, Robotics).
  * **Nagpur Division:** Scale & Employability Hub (Cloud computing, IT services, Logistics).
  * **Gadchiroli / Rural:** Local Priority Sectors (AgriTech, Handicrafts, Digital Literacy).
* **District Skill Plans & Budgets (\`/government/budget\`):** Formulates 2026-27 annual training plans, seat expansion targets, and capex budget allocations.
* **Labour-Market Forecaster (\`/government/forecast\`):** Simulates what happens if training capacity expands by +25%.`,
        links: [
          { label: "Government Command Center", url: "/government" },
          { label: "District Admin (Pune)", url: "/district-admin" },
          { label: "Pan-India Map", url: "/government/india" },
          { label: "Policy Copilot", url: "/government/copilot" },
        ],
        category: "Government & Districts",
        suggestedPrompts: [
          "What is the difference between Pune and Gadchiroli strategies?",
          "How does the policy simulation work?",
          "Show me the SIH problem statement",
        ],
      };
    }

    // 7. Employer Portal & Feedback
    if (
      q.includes("employer") ||
      q.includes("recruiter") ||
      q.includes("hiring") ||
      q.includes("feedback") ||
      q.includes("talent pool")
    ) {
      return {
        answer: `### 🏢 Employer Recruitment Operating System
CareerIS eliminates resume spam and hiring friction for companies:

* **Verified Candidate Shortlisting (\`/employer/candidates\`):** Candidates are ranked strictly by verified competencies and project proofs rather than keyword claims.
* **Precision Skill Requisitions (\`/employer/jobs\`):** Post jobs defined by granular skill taxonomy requirements and required proficiency levels.
* **Closed-Loop Performance Feedback (\`/employer/feedback\`):** Post-placement feedback form allowing HR/Managers to rate employee on-the-job readiness.
* **Train vs Hire Analysis (\`/employer/workforce\`):** AI analyzes whether it is faster and cheaper to reskill existing workers or recruit new graduates.`,
        links: [
          { label: "Employer Dashboard", url: "/employer" },
          { label: "Candidate Shortlist", url: "/employer/candidates" },
          { label: "Employer Feedback Form", url: "/employer/feedback" },
          { label: "Recruiter Copilot", url: "/employer/copilot" },
        ],
        category: "Employer & Recruiting",
        suggestedPrompts: [
          "How does employer feedback update the system?",
          "How are candidate skills verified?",
          "Show me the Nilesh Purvey story",
        ],
      };
    }

    // 8. Website Navigation / Guide
    if (
      q.includes("guide") ||
      q.includes("navigate") ||
      q.includes("pages") ||
      q.includes("features") ||
      q.includes("menu") ||
      q.includes("where is")
    ) {
      return {
        answer: `### 🧭 CareerIS Quick Navigation Guide
Here is where you can find all core portals and features:

| Portal | Direct Link | Key Features |
| :--- | :--- | :--- |
| **Home / Landing** | [\`/ (Home)\`](/) | Platform overview, stats, national pilot metrics |
| **Candidate** | [\`/candidate\`](/candidate) | Skill Passport, Gap Analysis, Job matches, Projects |
| **Jobs & Matching** | [\`/jobs\`](/jobs) | Explainable match breakdowns (e.g. 67% vs 91%) |
| **Skill Graph** | [\`/skills\`](/skills) | National taxonomy graph & relations |
| **Roadmaps** | [\`/career-paths\`](/career-paths) | AI Developer, EV, Robotics career progression |
| **Courses** | [\`/courses\`](/courses) | Gap-targeted vocational course catalog |
| **ITI / Training** | [\`/training-provider\`](/training-provider) | Curriculum audit, Lab equipment, Trainer capacity |
| **District Admin** | [\`/district-admin\`](/district-admin) | Pune / Maharashtra DSDO workforce planning |
| **Government** | [\`/government\`](/government) | Pan-India 28 States, Budgeting, Forecasts |
| **Employer** | [\`/employer\`](/employer) | Verified talent shortlist & closed feedback form |
| **AI Copilot** | [\`/copilot\`](/copilot) | National Predictive Intelligence chat |
| **About / Manifesto** | [\`/about\`](/about) | Architectural manifesto & data ethics |`,
        links: [
          { label: "Candidate Hub", url: "/candidate" },
          { label: "Employer Hub", url: "/employer" },
          { label: "Training Hub", url: "/training-provider" },
          { label: "Government Hub", url: "/government" },
        ],
        category: "Site Navigation",
        suggestedPrompts: [
          "Tell me about SIH26134",
          "Explain the 23-step Live Learning Loop",
          "Who is Nilesh Purvey?",
        ],
      };
    }

    // 9. Default / General AI Overview
    return {
      answer: `### 🌟 Welcome to CareerIS AI Assistant!
I am your platform guide with full knowledge of the **CareerIS National Labour-Market Intelligence Platform** (*SIH26134 - Government of Maharashtra*).

**How can I assist you today?**
* 🏛️ **SIH Problem Statement:** Ask about \`SIH26134\` and how we solve the Maharashtra skill alignment challenge.
* 📖 **The Comic Story:** Ask about **Nilesh Purvey** and how his match score climbed from 67% to 91%.
* 🔄 **The Closed Loop:** Learn how employer feedback updates ITI curricula and government budgets.
* 🎓 **Candidate:** Learn about the **Skill Passport** and **Explainable Job Matching**.
* 🏫 **Vocational / ITI:** Explore **Curriculum Audits**, **GPU Lab Readiness**, and **Trainer Capacity**.
* 🧭 **Website Tour:** Ask me to guide you to any portal or feature across the application.`,
      links: [
        { label: "About Platform", url: "/about" },
        { label: "Candidate Portal", url: "/candidate" },
        { label: "Government Command Center", url: "/government" },
        { label: "Predictive Copilot", url: "/copilot" },
      ],
      category: "General Intelligence",
      suggestedPrompts: [
        "Tell me about CareerIS & SIH26134",
        "Who is Nilesh Purvey and what is his story?",
        "Explain the 23-step Live Learning Loop",
        "Guide me around the website",
      ],
    };
  }
}

export const globalAIAssistantService = new GlobalAIAssistantService();
