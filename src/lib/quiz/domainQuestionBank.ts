export interface QuizQuestion {
  id: string;
  skill: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  recommendedCourse?: {
    title: string;
    provider: string;
    duration: string;
    rating: string;
    actionUrl: string;
  };
}

export interface DBCourse {
  id: string;
  skill: string;
  title: string;
  provider: string;
  providerType: "COMPANY" | "INSTITUTE" | "EDTECH";
  duration: string;
  rating: string;
  price: string;
  description: string;
}

// Master Skill-Mapped Technical Question & Course Bank
export const SKILL_QUESTION_DATABASE: Record<
  string,
  {
    questions: {
      difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
    course: {
      title: string;
      provider: string;
      duration: string;
      rating: string;
      actionUrl: string;
    };
  }
> = {
  python: {
    questions: [
      {
        difficulty: "EASY",
        question: "In Python, which built-in data structure stores unordered collections of unique elements?",
        options: ["List", "Tuple", "Set", "Dictionary Keys Array"],
        correctIndex: 2,
        explanation: "A Set in Python is an unordered collection with no duplicate elements and O(1) membership testing.",
      },
      {
        difficulty: "MEDIUM",
        question: "In Python, how does the asyncio event loop achieve concurrency for high-volume network calls?",
        options: [
          "By spawning multiple OS kernel processes for every socket",
          "By utilizing non-blocking async/await coroutines on a single event loop thread",
          "By disabling the Global Interpreter Lock (GIL)",
          "By using CPU L3 cache memory pinning",
        ],
        correctIndex: 1,
        explanation: "asyncio handles concurrent I/O by pausing coroutines during I/O waits and yielding control back to the event loop.",
      },
      {
        difficulty: "HARD",
        question: "What happens when you create a generator using the 'yield' keyword instead of returning a list in memory?",
        options: [
          "It allocates full memory upfront on the heap",
          "It produces an iterable that generates values lazily on-demand, consuming minimal memory",
          "It forces Python to execute code in C-extension mode",
          "It locks the GIL until iteration ends",
        ],
        correctIndex: 1,
        explanation: "Generators evaluate expressions on-demand with lazy evaluation, preserving memory for large data streams.",
      },
    ],
    course: {
      title: "The Goaty Notes: Ultimate AI/ML & Python Architecture Bundle",
      provider: "DNA",
      duration: "8+ Hours 4K + 20+ Production Repos",
      rating: "5.0 ⭐ (94% Choose This)",
      actionUrl: "https://www.thegoatynotes.workers.dev",
    },
  },

  docker: {
    questions: [
      {
        difficulty: "EASY",
        question: "What is the primary function of the Dockerfile in containerized application development?",
        options: [
          "It is a runtime log file of running containers",
          "It is a text script containing automated instructions to build a container image",
          "It is a virtual machine BIOS configuration",
          "It is an SSL certificate generator",
        ],
        correctIndex: 1,
        explanation: "A Dockerfile contains sequentially executed commands (FROM, RUN, COPY, CMD) to assemble a container image.",
      },
      {
        difficulty: "MEDIUM",
        question: "Why are multi-stage Docker builds recommended for production microservices?",
        options: [
          "They merge all intermediate layers into a virtual RAM disk",
          "They separate the compilation environment from the minimal runtime image to drastically reduce image size and attack surface",
          "They eliminate the requirement for Linux kernel cgroups",
          "They enable root access to host peripherals",
        ],
        correctIndex: 1,
        explanation: "Multi-stage builds leave heavy compilers, SDKs, and build dependencies behind in the builder stage.",
      },
      {
        difficulty: "HARD",
        question: "In container orchestration, what mechanism ensures zero-downtime rolling deployments during updates?",
        options: [
          "Readiness and liveness probe health checking before traffic rerouting",
          "Terminating all existing pods instantly before pulling new images",
          "Hard rebooting host worker nodes",
          "Flushing IPTables routing tables",
        ],
        correctIndex: 0,
        explanation: "Readiness probes ensure new container instances are fully warmed and accepting traffic before old pods are decommissioned.",
      },
    ],
    course: {
      title: "Production Docker & Container Mastery for Developers",
      provider: "Cloud Native Foundation",
      duration: "3 Weeks",
      rating: "4.8 ⭐ (8.9k reviews)",
      actionUrl: "/courses",
    },
  },

  fastapi: {
    questions: [
      {
        difficulty: "EASY",
        question: "Which schema validation library is natively integrated into FastAPI request models?",
        options: ["Pydantic", "Marshmallow", "Cerberus", "JSONSchema-CLI"],
        correctIndex: 0,
        explanation: "FastAPI natively uses Pydantic BaseModel for typed request validation and automatic Swagger/OpenAPI docs generation.",
      },
      {
        difficulty: "MEDIUM",
        question: "In FastAPI, what is the purpose of the 'Depends' dependency injection system?",
        options: [
          "To install third-party packages from PyPI at runtime",
          "To share database sessions, authentication security, and business logic across route handlers cleanly",
          "To compress response payloads into Gzip",
          "To enforce synchronous database locks",
        ],
        correctIndex: 1,
        explanation: "FastAPI's Depends system provides powerful, reusable dependency injection for DB sessions, tokens, and guards.",
      },
    ],
    course: {
      title: "FastAPI High-Performance Backend & Microservices",
      provider: "Enterprise Tech Academy",
      duration: "3 Weeks",
      rating: "4.9 ⭐ (6.2k reviews)",
      actionUrl: "/courses",
    },
  },

  pytorch: {
    questions: [
      {
        difficulty: "EASY",
        question: "What is the core multi-dimensional array object in PyTorch used for tensor computations?",
        options: ["torch.Tensor", "numpy.ndarray", "torch.DataFrame", "torch.Matrix"],
        correctIndex: 0,
        explanation: "torch.Tensor is the fundamental data structure supporting GPU acceleration and automatic differentiation.",
      },
      {
        difficulty: "HARD",
        question: "Why must 'optimizer.zero_grad()' be called before 'loss.backward()' in a PyTorch training loop?",
        options: [
          "To clear allocated GPU VRAM memory",
          "To reset accumulated gradient buffers from the previous backward pass so they do not add up",
          "To freeze model weights during forward propagation",
          "To re-seed the random number generator",
        ],
        correctIndex: 1,
        explanation: "By default, PyTorch accumulates gradients on every backward call; zero_grad() resets them to zero.",
      },
    ],
    course: {
      title: "The Goaty Notes: Ultimate AI/ML & PyTorch Masterclass",
      provider: "DNA",
      duration: "8+ Hours 4K Video + Math to Code",
      rating: "5.0 ⭐ (94% Choose This)",
      actionUrl: "https://www.thegoatynotes.workers.dev",
    },
  },

  rag: {
    questions: [
      {
        difficulty: "MEDIUM",
        question: "In a Retrieval-Augmented Generation (RAG) system, how are unstructured documents indexed for semantic similarity search?",
        options: [
          "Documents are chunked, converted into dense numerical vector embeddings, and stored in a vector database like Pinecone/Qdrant",
          "Documents are converted into base64 strings and stored in cookies",
          "Documents are converted into CSV tables",
          "Documents are indexed using alphabetical sorting only",
        ],
        correctIndex: 0,
        explanation: "RAG uses embedding models to project text into semantic vector space for fast k-NN/cosine similarity lookup.",
      },
      {
        difficulty: "HARD",
        question: "What technique combines dense vector cosine search with BM25 sparse keyword ranking to improve retrieval recall for technical terms?",
        options: [
          "Hybrid Search with Reciprocal Rank Fusion (RRF)",
          "Simple prompt string concatenation",
          "Increasing LLM context window to 1 Million tokens without retrieval",
          "Zero-shot temperature sampling",
        ],
        correctIndex: 0,
        explanation: "Hybrid Search fuses semantic dense vectors and exact keyword sparse inverted index via Reciprocal Rank Fusion.",
      },
    ],
    course: {
      title: "The Goaty Notes: Production RAG, LLM & FAANG System Design",
      provider: "DNA",
      duration: "20+ Production AI Repos",
      rating: "5.0 ⭐ (VIP All-Access Pass)",
      actionUrl: "https://www.thegoatynotes.workers.dev",
    },
  },

  react: {
    questions: [
      {
        difficulty: "EASY",
        question: "Which React hook is used to manage local component state in functional components?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctIndex: 0,
        explanation: "useState is the core hook for managing reactive state variables within a functional React component.",
      },
      {
        difficulty: "MEDIUM",
        question: "What is the purpose of React's Virtual DOM reconciliation process?",
        options: [
          "To compute the minimal set of real DOM mutations needed by diffing virtual trees, maximizing UI render performance",
          "To execute backend SQL queries in the browser",
          "To bypass CSS styling entirely",
          "To store user credentials securely",
        ],
        correctIndex: 0,
        explanation: "Virtual DOM diffing calculates the delta between renders and applies only necessary changes to the real DOM.",
      },
    ],
    course: {
      title: "Modern React 19 & Next.js Fullstack Engineering",
      provider: "Frontend Masters / Meta Certified",
      duration: "4 Weeks",
      rating: "4.9 ⭐ (9.3k reviews)",
      actionUrl: "/courses",
    },
  },

  sql: {
    questions: [
      {
        difficulty: "EASY",
        question: "Which SQL clause is used to filter rows before any grouping or aggregation takes place?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        correctIndex: 0,
        explanation: "WHERE filters individual table rows prior to aggregation, while HAVING filters post-aggregated groups.",
      },
      {
        difficulty: "HARD",
        question: "How does a B-Tree composite index on columns (user_id, created_at) optimize a query with WHERE user_id = 42 ORDER BY created_at DESC?",
        options: [
          "It enables an index seek on user_id and extracts sorted created_at records directly without a separate in-memory sorting step",
          "It converts the relational table into a NoSQL document store",
          "It duplicates data across multiple partitions",
          "It compresses the database file on disk",
        ],
        correctIndex: 0,
        explanation: "Composite indexes provide both filtering seek and pre-ordered leaf traversal, avoiding expensive temporary sort operations.",
      },
    ],
    course: {
      title: "Mastering Relational Databases, SQL Optimization & Indexing",
      provider: "Oracle & PostgreSQL Alliance",
      duration: "3 Weeks",
      rating: "4.8 ⭐ (11.2k reviews)",
      actionUrl: "/courses",
    },
  },

  electrical: {
    questions: [
      {
        difficulty: "EASY",
        question: "According to Ohm's Law, what is the relationship between Voltage (V), Current (I), and Resistance (R)?",
        options: ["V = I × R", "V = I / R", "V = R / I", "V = I + R"],
        correctIndex: 0,
        explanation: "Ohm's Law states that potential difference is directly proportional to current through a resistance (V = IR).",
      },
      {
        difficulty: "MEDIUM",
        question: "In an industrial electrical plant, why are capacitor banks installed across inductive motor loads?",
        options: [
          "To supply leading reactive power and correct lagging power factor near unity (0.98)",
          "To increase the grid line frequency to 100 Hz",
          "To step down three-phase voltage to DC",
          "To reduce physical wire gauge size only",
        ],
        correctIndex: 0,
        explanation: "Capacitor banks provide reactive VARs, eliminating inductive penalties and improving system energy efficiency.",
      },
      {
        difficulty: "HARD",
        question: "In an EV Battery Management System (BMS), what does passive cell balancing accomplish?",
        options: [
          "It bleeds excess charge from higher-voltage series cells through shunt bypass resistors to ensure all cells reach identical voltage",
          "It refills electrolyte fluid automatically",
          "It reverses battery polarity during fast charging",
          "It bypasses the high-voltage fuse",
        ],
        correctIndex: 0,
        explanation: "Passive cell balancing dissipates energy from overcharged cells as heat to prevent unbalanced over-voltage during charging.",
      },
    ],
    course: {
      title: "EV Power Systems & Advanced Battery Management (BMS)",
      provider: "Tata Motors & Automotive Skills Council (ASDC)",
      duration: "5 Weeks",
      rating: "4.9 ⭐ (7.8k reviews)",
      actionUrl: "/courses",
    },
  },
};

/**
 * STRICT SKILL QUIZ GENERATOR:
 * Only generates questions for skills the user explicitly declared!
 * No outside/unrelated skills!
 */
export function generateStrictSkillQuiz(declaredSkills: string[]): QuizQuestion[] {
  if (!declaredSkills || declaredSkills.length === 0) {
    declaredSkills = ["Python"];
  }

  const generatedQuestions: QuizQuestion[] = [];

  // Match each declared skill
  declaredSkills.forEach((rawSkill) => {
    const skillKey = rawSkill.trim().toLowerCase();

    // Check if we have exact or substring matches in our database
    let foundEntryKey: string | null = null;

    for (const key of Object.keys(SKILL_QUESTION_DATABASE)) {
      if (skillKey.includes(key) || key.includes(skillKey)) {
        foundEntryKey = key;
        break;
      }
    }

    if (foundEntryKey) {
      const entry = SKILL_QUESTION_DATABASE[foundEntryKey];
      // Pick questions for this specific declared skill
      entry.questions.forEach((q, idx) => {
        generatedQuestions.push({
          id: `${foundEntryKey}-${idx}-${Date.now()}`,
          skill: rawSkill.trim(),
          difficulty: q.difficulty,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          recommendedCourse: entry.course,
        });
      });
    } else {
      // Dynamic Intelligent Question for any custom declared skill (e.g. "Kubernetes", "C++", "AutoCAD")
      generatedQuestions.push({
        id: `custom-${rawSkill.toLowerCase().replace(/\s+/g, "-")}-1`,
        skill: rawSkill.trim(),
        difficulty: "MEDIUM",
        question: `When implementing professional production workflows in ${rawSkill.trim()}, what is the critical design best-practice?`,
        options: [
          `Writing modular, decoupled components with robust automated error handling and structured testing`,
          `Bypassing memory safety checks for maximum speed`,
          `Hardcoding production credentials directly into source scripts`,
          `Disabling logging and monitoring layers`,
        ],
        correctIndex: 0,
        explanation: `In ${rawSkill.trim()}, modular architecture and robust automated validation ensure production reliability and zero-downtime maintenance.`,
        recommendedCourse: {
          title: `Professional ${rawSkill.trim()} Industrial Certification & Hands-on Lab`,
          provider: "Verified Industry Partner Network",
          duration: "4 Weeks (Applied Track)",
          rating: "4.9 ⭐ (Enterprise Accredited)",
          actionUrl: "/courses",
        },
      });
    }
  });

  // Limit to at most 4 questions (1 per key declared skill), shuffled
  const shuffled = generatedQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}
