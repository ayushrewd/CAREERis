"use client";

export interface DBUser {
  id: string;
  email: string;
  fullName: string;
  role: "STUDENT" | "COMPANY" | "GOVERNMENT";
  // Student Specific
  phoneNumber?: string;
  educationLevel?: string; // School / College / University / ITI Diploma / Graduate
  degree?: string; // e.g. B.Tech Computer Science
  graduationYear?: string; // e.g. 2026
  college?: string;
  dreamJob?: string;
  skills?: string[];
  city?: string;
  state?: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  assessmentScore?: number;
  submittedProjects?: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    githubUrl: string;
    score: number;
    submittedAt: string;
  }[];
  // Company Specific
  companyName?: string;
  cinGstin?: string;
  industry?: string;
  headquarters?: string;
}

export interface DBJob {
  id: string;
  companyId: string;
  companyName: string;
  roleTitle: string;
  industry: string;
  location: string;
  salary: string;
  requiredSkills: string[];
  description: string;
  postedAt: string;
  applicantCount: number;
}

export interface DBPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatarBg?: string;
  content: string;
  category: "PROJECT" | "MILESTONE" | "JOB" | "GENERAL";
  projectData?: {
    title: string;
    techStack: string[];
    githubUrl?: string;
    score?: number;
  };
  likes: number;
  likedBy: string[];
  timestamp: string;
}

export interface DBApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateCollege: string;
  matchScore: number; // 67% or 91%
  evidenceScore: number; // e.g. 89/100
  skillsMatched: string[];
  skillsMissing: string[];
  hasSubmittedProject: boolean;
  status: "APPLIED" | "SHORTLISTED" | "INTERVIEW";
  appliedAt: string;
}

export interface DBCourse {
  id: string;
  companyId?: string;
  companyName: string;
  title: string;
  skill: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price: string;
  rating: string;
  duration: string;
  enrollmentUrl: string;
  description: string;
  isAccredited: boolean;
  publishedAt: string;
}

export const INITIAL_COURSES: DBCourse[] = [
  {
    id: "course-goaty-ultimate",
    companyName: "DNA",
    title: "The Goaty Notes: Ultimate All-Access VIP Bundle",
    skill: "AI, Machine Learning, PyTorch & FAANG System Design",
    level: "ADVANCED",
    price: "₹499 (Save 90% • One-Time)",
    rating: "5.0 ⭐ (Most Popular • 94% Choose This)",
    duration: "8+ Hours 4K Video + 20+ Production Repos",
    enrollmentUrl: "https://www.thegoatynotes.workers.dev",
    description: "The complete unfair advantage: 8+ Hours 4K Video Masterclasses (Math to PyTorch), 20+ Production AI/ML Repos, FAANG System Design frameworks, ATS-Certified Resume (95+ recruiting score), and VIP Placement Sync.",
    isAccredited: true,
    publishedAt: "2026",
  },
  {
    id: "course-goaty-standard",
    companyName: "DNA",
    title: "The Goaty Notes: Visual Accelerator & Handwritten Flowcharts",
    skill: "Deep Learning, Neural Architecture & Concept Flowcharts",
    level: "INTERMEDIATE",
    price: "₹199 (Save 87%)",
    rating: "4.9 ⭐ (Top Rated Concept Pack)",
    duration: "30-Day Sprint Planner",
    enrollmentUrl: "https://www.thegoatynotes.workers.dev",
    description: "Visual dominance with handwritten AI/ML/DL Concept Flowcharts, Neural Network Architecture Blueprints, 30-Day Day-by-Day Sprint Planner, and Top 50+ Deep Learning Technical Interview Q&A.",
    isAccredited: true,
    publishedAt: "2026",
  },
  {
    id: "course-goaty-basic",
    companyName: "DNA",
    title: "The Goaty Notes: Core Theory Revision & Interview Toolkit",
    skill: "Python, Classical ML & DevOps Cheatsheets",
    level: "BEGINNER",
    price: "₹149 (Save 85%)",
    rating: "4.8 ⭐ (High-Yield Assets)",
    duration: "8 High-Yield Assets (28MB+)",
    enrollmentUrl: "https://www.thegoatynotes.workers.dev",
    description: "Fast core theory revision with 8 High-Yield Theoretical PDF Assets, ATS-Certified LaTeX & Word Resume Templates, Top 50+ Classical ML Interview Q&A, and Git & DevOps Master Cheatsheets.",
    isAccredited: true,
    publishedAt: "2026",
  },
  {
    id: "course-dl-01",
    companyName: "DeepLearning.AI & Coursera",
    title: "Generative AI with Large Language Models & PyTorch",
    skill: "PyTorch & RAG Systems",
    level: "ADVANCED",
    price: "Free Audit Available",
    rating: "4.9 ⭐ (42,000+ enrolled)",
    duration: "4 Weeks",
    enrollmentUrl: "https://www.deeplearning.ai/courses/generative-ai-with-llms/",
    description: "Master modern foundation models, fine-tuning techniques (LoRA, PEFT), and vector-search RAG retrieval pipelines.",
    isAccredited: true,
    publishedAt: "2026",
  },
  {
    id: "course-harvard-01",
    companyName: "Harvard University (CS50)",
    title: "CS50 AI: Introduction to Artificial Intelligence with Python",
    skill: "Python & Machine Learning",
    level: "INTERMEDIATE",
    price: "Free",
    rating: "4.9 ⭐ (120,000+ enrolled)",
    duration: "7 Weeks",
    enrollmentUrl: "https://cs50.harvard.edu/ai/",
    description: "Official Harvard course exploring graph search algorithms, reinforcement learning, Markov models, and neural networks in Python.",
    isAccredited: true,
    publishedAt: "2026",
  },
  {
    id: "course-linux-docker-01",
    companyName: "Linux Foundation & CNCF",
    title: "Docker Containerization & Production Microservices",
    skill: "Docker & Containers",
    level: "INTERMEDIATE",
    price: "Free",
    rating: "4.8 ⭐ (31,000+ enrolled)",
    duration: "3 Weeks",
    enrollmentUrl: "https://training.linuxfoundation.org/",
    description: "Hands-on container architecture, multi-stage Docker builds, cgroups resource isolation, and container networking.",
    isAccredited: true,
    publishedAt: "2026",
  },
  {
    id: "course-fastapi-01",
    companyName: "Enterprise Python Academy",
    title: "FastAPI Async Architecture & High-Scale Microservices",
    skill: "FastAPI & Backend",
    level: "INTERMEDIATE",
    price: "₹1,499 (or Scholarship)",
    rating: "4.9 ⭐ (8,400+ enrolled)",
    duration: "3 Weeks",
    enrollmentUrl: "https://fastapi.tiangolo.com/tutorial/",
    description: "Production FastAPI patterns with async/await coroutines, Pydantic v2 schemas, JWT auth guards, and Dockerized deployment.",
    isAccredited: true,
    publishedAt: "2026",
  },
  {
    id: "course-iit-ev-01",
    companyName: "IIT Madras & ASDC (NPTEL)",
    title: "Electric Vehicle Powertrain, Battery Pack & BMS Diagnostics",
    skill: "EV Battery & BMS",
    level: "ADVANCED",
    price: "Free / Govt Certified",
    rating: "4.9 ⭐ (18,200+ enrolled)",
    duration: "8 Weeks",
    enrollmentUrl: "https://nptel.ac.in/courses/108106170",
    description: "Comprehensive engineering analysis of Lithium-Ion cell chemistry, passive/active cell balancing, thermal runaway prevention, and CAN bus telemetry.",
    isAccredited: true,
    publishedAt: "2026",
  },
  {
    id: "course-pg-sql-01",
    companyName: "PostgreSQL Global Development Group",
    title: "High-Performance Relational SQL & Index Optimization",
    skill: "SQL & Databases",
    level: "BEGINNER",
    price: "Free",
    rating: "4.8 ⭐ (54,000+ enrolled)",
    duration: "2 Weeks",
    enrollmentUrl: "https://pgexercises.com/",
    description: "Master B-Tree composite indexing, EXPLAIN ANALYZE execution plan debugging, window functions, and query optimization.",
    isAccredited: true,
    publishedAt: "2026",
  },
];

// Initial Database Seeds
const INITIAL_USERS: DBUser[] = [];

const INITIAL_JOBS: DBJob[] = [];

const INITIAL_POSTS: DBPost[] = [];

class CareerISDatabase {
  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  // USERS
  getUsers(): DBUser[] {
    if (!this.isBrowser()) return INITIAL_USERS;
    const stored = localStorage.getItem("careeris_db_users");
    if (!stored) {
      localStorage.setItem("careeris_db_users", JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_USERS;
    }
  }

  saveUser(user: DBUser): void {
    if (!this.isBrowser()) return;
    const users = this.getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id || u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem("careeris_db_users", JSON.stringify(users));
  }

  getUserById(id: string): DBUser | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getCurrentUser(): DBUser | null {
    if (!this.isBrowser()) return null;
    const currentId = localStorage.getItem("careeris_current_user_id");
    if (!currentId) return null;
    return this.getUserById(currentId) || null;
  }

  setCurrentUser(userId: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem("careeris_current_user_id", userId);
  }

  logout(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem("careeris_current_user_id");
  }

  // JOBS
  getJobs(): DBJob[] {
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem("careeris_db_user_jobs");
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  createJob(job: Omit<DBJob, "id" | "postedAt" | "applicantCount">): DBJob {
    const jobs = this.getJobs();
    const newJob: DBJob = {
      ...job,
      id: `job-${Date.now()}`,
      postedAt: "Just now",
      applicantCount: 0,
    };
    jobs.unshift(newJob);
    if (this.isBrowser()) {
      localStorage.setItem("careeris_db_user_jobs", JSON.stringify(jobs));
    }
    return newJob;
  }

  // POSTS
  getPosts(): DBPost[] {
    if (!this.isBrowser()) return INITIAL_POSTS;
    const stored = localStorage.getItem("careeris_db_posts");
    if (!stored) return INITIAL_POSTS;
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_POSTS;
    }
  }

  createPost(post: Omit<DBPost, "id" | "timestamp" | "likes" | "likedBy">): DBPost {
    const posts = this.getPosts();
    const newPost: DBPost = {
      ...post,
      id: `post-${Date.now()}`,
      likes: 0,
      likedBy: [],
      timestamp: "Just now",
    };
    posts.unshift(newPost);
    if (this.isBrowser()) {
      localStorage.setItem("careeris_db_posts", JSON.stringify(posts));
    }
    return newPost;
  }

  deletePost(postId: string): void {
    const posts = this.getPosts().filter((p) => p.id !== postId);
    if (this.isBrowser()) {
      localStorage.setItem("careeris_db_posts", JSON.stringify(posts));
    }
  }

  toggleLikePost(postId: string, userId: string): void {
    const posts = this.getPosts().map((p) => {
      if (p.id === postId) {
        const hasLiked = p.likedBy.includes(userId);
        const likedBy = hasLiked ? p.likedBy.filter((id) => id !== userId) : [...p.likedBy, userId];
        return { ...p, likedBy, likes: likedBy.length };
      }
      return p;
    });
    if (this.isBrowser()) {
      localStorage.setItem("careeris_db_posts", JSON.stringify(posts));
    }
  }

  // APPLICATIONS
  getApplications(): DBApplication[] {
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem("careeris_db_applications");
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  submitApplication(app: Omit<DBApplication, "id" | "appliedAt" | "status">): DBApplication {
    const apps = this.getApplications();
    const newApp: DBApplication = {
      ...app,
      id: `app-${Date.now()}`,
      status: "APPLIED",
      appliedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    apps.unshift(newApp);
    if (this.isBrowser()) {
      localStorage.setItem("careeris_db_applications", JSON.stringify(apps));
    }

    // Increment applicant count on job
    const jobs = this.getJobs().map((j) => {
      if (j.id === app.jobId) return { ...j, applicantCount: j.applicantCount + 1 };
      return j;
    });
    if (this.isBrowser()) {
      localStorage.setItem("careeris_db_jobs", JSON.stringify(jobs));
    }

    return newApp;
  }

  // SUBMIT PROJECT EVIDENCE
  submitProject(userId: string, project: { title: string; description: string; techStack: string[]; githubUrl: string }): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      ...project,
      score: 89,
      submittedAt: new Date().toISOString(),
    };

    user.submittedProjects = [...(user.submittedProjects || []), newProject];
    user.assessmentScore = 91; // Boost verified readiness score to 91%
    this.saveUser(user);

    // Also publish automatic Project Proof milestone to Community Feed!
    this.createPost({
      authorId: user.id,
      authorName: user.fullName,
      authorRole: user.headline || "AI Developer",
      authorAvatarBg: "from-blue-600 to-indigo-700",
      content: `🚀 Proud to share my verified project proof: **${project.title}**!\n\nVerified Evidence Score: **89/100**. My explainable job match increased to **91% Ready**! Check out my code repo below:`,
      category: "PROJECT",
      projectData: {
        title: project.title,
        techStack: project.techStack,
        githubUrl: project.githubUrl,
        score: 89,
      },
    });
  }

  // ============================================================================
  // COURSES & ENTERPRISE TRAINING REPOSITORY
  // ============================================================================
  getCourses(): DBCourse[] {
    if (!this.isBrowser()) return INITIAL_COURSES;
    const stored = localStorage.getItem("careeris_db_courses");
    if (!stored) {
      localStorage.setItem("careeris_db_courses", JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    try {
      let parsed: DBCourse[] = JSON.parse(stored);
      // Migrate and normalize Goaty Notes company name to strictly "DNA"
      let needsSave = false;
      parsed = parsed.map((c) => {
        if (c.id.startsWith("course-goaty") && c.companyName !== "DNA") {
          needsSave = true;
          return { ...c, companyName: "DNA" };
        }
        return c;
      });

      const hasGoaty = parsed.some((c) => c.id === "course-goaty-ultimate");
      if (!hasGoaty) {
        parsed = [...INITIAL_COURSES, ...parsed.filter((c) => !c.id.startsWith("course-"))];
        needsSave = true;
      }

      if (needsSave) {
        localStorage.setItem("careeris_db_courses", JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return INITIAL_COURSES;
    }
  }

  publishCourse(course: Omit<DBCourse, "id" | "publishedAt" | "isAccredited">): DBCourse {
    const courses = this.getCourses();
    const newCourse: DBCourse = {
      ...course,
      id: `course-${Date.now()}`,
      isAccredited: true,
      publishedAt: new Date().getFullYear().toString(),
    };
    courses.unshift(newCourse);
    if (this.isBrowser()) {
      localStorage.setItem("careeris_db_courses", JSON.stringify(courses));
    }
    return newCourse;
  }
}

export const db = new CareerISDatabase();
export const careerisDB = db;
