import { randomUUID } from "node:crypto";

export type FreshQuestion = {
  id: string;
  skill: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Seed = { prompt: string; correct: string; distractors: [string, string, string]; explanation: string };

const BANK: Record<string, Seed[]> = {
  "artificial intelligence": [{ prompt: "Which description best defines artificial intelligence?", correct: "Systems performing tasks that normally require human intelligence", distractors: ["Only storing data in relational tables", "A fixed calculator with no decision logic", "A network cable communication standard"], explanation: "AI covers systems that perceive, reason, learn, or act on tasks associated with human intelligence." }],
  "deep learning": [{ prompt: "What most clearly distinguishes deep learning from many classical ML approaches?", correct: "It learns hierarchical representations through multi-layer neural networks", distractors: ["It never needs training data", "It uses only spreadsheet formulas", "It cannot process images or text"], explanation: "Deep neural networks learn multiple levels of representation from data." }],
  "machine learning": [{ prompt: "What is the purpose of a validation set in machine learning?", correct: "Tune model choices without evaluating on the held-out test set", distractors: ["Store production passwords", "Replace all training examples", "Guarantee perfect real-world accuracy"], explanation: "Validation data supports model selection while preserving the test set for final unbiased evaluation." }],
  "generative ai": [{ prompt: "What does a generative AI model primarily learn to do?", correct: "Model a data distribution to produce new content", distractors: ["Only sort database rows", "Physically manufacture processors", "Encrypt every input irreversibly"], explanation: "Generative models learn patterns in data and sample new text, images, audio, or other content." }],
  "ai agents": [{ prompt: "Which combination is central to an AI agent?", correct: "A goal, observations, actions, and a decision loop", distractors: ["A static PDF with no actions", "Only a database index", "A CSS stylesheet and font"], explanation: "An agent observes state, reasons toward a goal, takes actions, and uses resulting feedback." }],
  "agentic ai": [{ prompt: "What makes an AI workflow agentic rather than a single model response?", correct: "It plans and executes multiple tool-assisted steps toward a goal", distractors: ["It always returns exactly one token", "It removes all system boundaries", "It requires no evaluation or feedback"], explanation: "Agentic systems manage multi-step decisions, tools, memory, and feedback toward an objective." }],
  "multi-agent systems": [{ prompt: "Why define explicit roles and protocols in a multi-agent system?", correct: "To coordinate responsibilities and reduce conflicting actions", distractors: ["To make every agent share an identical hidden state", "To eliminate all communication", "To bypass authorization controls"], explanation: "Clear roles, communication, and arbitration make multi-agent coordination reliable." }],
  "large language models": [{ prompt: "During inference, what does an autoregressive language model predict?", correct: "A probability distribution for the next token given prior context", distractors: ["The exact future stock market price", "Only the number of words in a file", "A database primary key with no context"], explanation: "Autoregressive LLMs repeatedly estimate next-token probabilities from the available context." }],
  "natural language processing": [{ prompt: "Why is tokenization used in an NLP pipeline?", correct: "To convert text into units that a model can represent and process", distractors: ["To permanently delete punctuation from every language", "To turn a GPU into a database", "To guarantee semantic understanding"], explanation: "Tokenization maps text into processable units and identifiers for downstream models." }],
  "computer vision": [{ prompt: "What is the main goal of image augmentation during vision-model training?", correct: "Increase useful variation and improve generalization", distractors: ["Leak test labels into training", "Make every image identical", "Remove the need for evaluation"], explanation: "Transforms such as crops and flips expose the model to realistic variation and can reduce overfitting." }],
  "reinforcement learning": [{ prompt: "What signal directly guides learning in reinforcement learning?", correct: "Rewards received after actions and state transitions", distractors: ["Only supervised class labels for every state", "CSS rendering rules", "Database normalization forms"], explanation: "An RL agent learns a policy from reward signals generated through interaction with an environment." }],
  "unsupervised learning": [{ prompt: "Which task is a typical unsupervised-learning problem?", correct: "Grouping unlabeled observations into clusters", distractors: ["Predicting labels from a fully labeled dataset", "Compiling TypeScript", "Validating an email password"], explanation: "Unsupervised methods discover structure in data without target labels." }],
  "supervised learning": [{ prompt: "What information is required for standard supervised learning?", correct: "Training examples paired with target labels or values", distractors: ["Only unlabeled production logs", "No examples of any kind", "A reward function but no labeled targets"], explanation: "Supervised models learn a mapping from inputs to known target outputs." }],
  "prompt engineering": [{ prompt: "Which prompt is most likely to produce a reliably structured answer?", correct: "A prompt with clear context, constraints, and an explicit output format", distractors: ["A vague one-word request with no context", "A prompt containing mutually contradictory requirements", "An instruction that hides the required task"], explanation: "Clear goals, context, constraints, and schemas reduce ambiguity and improve consistency." }],
  "retrieval-augmented generation": [{ prompt: "What is the retriever responsible for in a RAG system?", correct: "Finding relevant source chunks to ground generation", distractors: ["Changing the model's physical hardware", "Deleting the source corpus after every query", "Guaranteeing every retrieved passage is true"], explanation: "The retriever selects relevant evidence that is placed into the generation context." }],
  "transfer learning": [{ prompt: "Why is transfer learning useful when task-specific data is limited?", correct: "A model can reuse representations learned from a larger source task", distractors: ["It guarantees zero training cost", "It prevents any domain mismatch", "It removes the need to validate results"], explanation: "Pretrained representations can reduce task-specific data and compute requirements." }],
  "fine-tuning": [{ prompt: "What happens during model fine-tuning?", correct: "Pretrained weights are updated using task- or domain-specific examples", distractors: ["The model weights are always deleted", "Only the UI color theme changes", "Training occurs without an objective function"], explanation: "Fine-tuning adapts pretrained parameters to desired behavior or a particular domain." }],
  "model evaluation": [{ prompt: "Why should model evaluation include data not used for training?", correct: "To estimate generalization on unseen examples", distractors: ["To maximize training-set memorization", "To expose secret test answers during training", "To avoid measuring errors"], explanation: "Held-out data provides a less biased estimate of performance beyond the training set." }],
  "ai safety": [{ prompt: "Which practice is part of responsible AI safety evaluation?", correct: "Test foreseeable misuse, failure modes, and mitigations before deployment", distractors: ["Disable monitoring after launch", "Assume the model cannot fail", "Give every model unrestricted production access"], explanation: "Safety work identifies hazards, measures them, and applies proportionate safeguards and monitoring." }],
  "responsible ai": [{ prompt: "Which set of concerns belongs in a responsible-AI review?", correct: "Fairness, privacy, transparency, accountability, and safety", distractors: ["Only interface animation speed", "Only the number of model parameters", "Avoiding documentation and human oversight"], explanation: "Responsible AI considers people, impacts, governance, privacy, fairness, transparency, and safety." }],
  numpy: [{ prompt: "Why is NumPy vectorization usually preferred over a Python loop for large numeric arrays?", correct: "Operations execute in optimized compiled code with less Python overhead", distractors: ["It converts every value into text", "It disables array broadcasting", "It always uses a remote server"], explanation: "Vectorized NumPy operations use efficient native loops and contiguous array operations." }],
  python: [{ prompt: "Which Python collection stores unique values and supports fast membership checks?", correct: "set", distractors: ["list", "tuple", "str"], explanation: "A set stores unique hashable elements and typically provides constant-time membership checks." }],
  pandas: [{ prompt: "Which pandas operation combines rows using matching key columns?", correct: "merge", distractors: ["plot", "rename", "astype"], explanation: "pandas.merge performs database-style joins using one or more keys." }],
  "power bi": [{ prompt: "What is a Power BI semantic model used for?", correct: "Define relationships, measures, and business logic for reports", distractors: ["Compile mobile applications", "Train physical robots", "Replace every source system"], explanation: "The semantic model organizes tables, relationships, calculations, and reusable business meaning." }],
  "data engineering": [{ prompt: "What is the primary purpose of an ETL pipeline in data engineering?", correct: "Extract data from sources, transform it into clean schemas, and load into a warehouse", distractors: ["Physically manufacture server motherboards", "Delete operational data without audit logs", "Turn web browsers into relational databases"], explanation: "ETL extracts raw operational records, cleans and models them, and loads them for analytical queries." }],
  "battery management systems": [{ prompt: "What is the primary safety function of a Battery Management System (BMS)?", correct: "Monitor cell voltage, temperature, and regulate state-of-charge balancing", distractors: ["Control vehicle radio infotainment volume", "Measure windshield wiper fluid levels", "Physically align tire suspension mechanically"], explanation: "A BMS protects battery cells against over-voltage, thermal runaway, and maintains pack state-of-charge balance." }],
  "can bus communication": [{ prompt: "Which feature characterizes the Controller Area Network (CAN) bus standard?", correct: "Differential two-wire signaling with non-destructive bitwise arbitration", distractors: ["Single-wire unshielded analog current loops", "High-speed gigabit optical fiber routing exclusively", "HTTP cloud REST requests over public Wi-Fi"], explanation: "CAN bus uses differential CAN_H and CAN_L lines and message identifier arbitration for deterministic prioritization." }],
  "high voltage safety": [{ prompt: "Under AIS 038 / ISO 6469 EV safety standards, what mechanism is mandatory for traction circuits?", correct: "Continuous isolation monitoring with automatic high-voltage contactor disconnect", distractors: ["Manual uninsulated wire jumper bypasses", "Disabling electrical fuses during high load", "Submerging battery contacts in tap water"], explanation: "EV traction standards require active insulation resistance monitoring and emergency contactor isolation." }],
  "ev powertrain diagnostics": [{ prompt: "When diagnosing an EV inverter fault, what parameter is analyzed first?", correct: "High-voltage DC bus voltage, phase currents, and gate-drive temperature telemetry", distractors: ["Exhaust oxygen sensor lambda ratios", "Engine carburettor fuel needle position", "Spark plug firing timing angles"], explanation: "EV powertrains require analysis of DC link voltage stability, three-phase inverter currents, and thermal telemetry." }],
  "programmable logic controllers": [{ prompt: "What are the core steps executed cyclically by a PLC?", correct: "Input scan, logic program execution, and output write", distractors: ["Random instruction jumping without timing", "Compiling client-side web CSS files", "Formatting hard disk drives on every cycle"], explanation: "A PLC deterministically scans inputs, solves ladder/structured logic, and updates physical outputs." }],
  "scada systems": [{ prompt: "What is the primary role of a SCADA system in industrial manufacturing?", correct: "Supervisory visualization, historical data logging, and centralized plant telemetry", distractors: ["Direct manual tool bit cutting on lathes", "Replacing all hardware electrical safety breakers", "Serving consumer social media applications"], explanation: "SCADA coordinates distributed RTUs and PLCs, providing operators with real-time process monitoring and alarming." }],
  "industrial robotics": [{ prompt: "How do nodes in ROS 2 communicate asynchronously across the computational graph?", correct: "Publish-subscribe topics built upon Data Distribution Service (DDS) middleware", distractors: ["Hard-coded global memory addresses across processes", "Synchronous blocking spreadsheet recalculations", "Sending unencrypted email messages between robots"], explanation: "ROS 2 uses DDS middleware to provide decentralized publish-subscribe topic communication." }],
  sql: [{ prompt: "Which SQL clause is used to filter results after an aggregation function has been applied?", correct: "HAVING", distractors: ["WHERE", "ORDER BY", "DISTINCT"], explanation: "WHERE filters rows before aggregation; HAVING filters the aggregated summary groups." }],
  typescript: [{ prompt: "What key advantage does TypeScript provide during application development?", correct: "Compile-time static type checking to detect errors before runtime", distractors: ["Executing directly in CPU cache without JavaScript interpretation", "Completely removing asynchronous functions", "Replacing backend database schemas automatically"], explanation: "TypeScript introduces a static type system that helps catch type errors at build time." }],
  react: [{ prompt: "In modern React, what is the role of the useEffect hook?", correct: "Handle side effects such as data fetching, subscriptions, and manual DOM mutations", distractors: ["Directly recompile the browser engine", "Replace all CSS stylesheet declarations", "Prevent all state updates permanently"], explanation: "useEffect synchronizes functional components with external APIs, network requests, and DOM events." }],
};

const FRAMES = [
  (skill: string, prompt: string) => `${skill} concept check: ${prompt}`,
  (skill: string, prompt: string) => `In a technical screening for ${skill}, answer this: ${prompt}`,
  (skill: string, prompt: string) => `Select the technically accurate response for ${skill}. ${prompt}`,
  (skill: string, prompt: string) => `Practical knowledge check — ${skill}: ${prompt}`,
];

function normalize(value: string) {
  return value.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
}

function seedsFor(skill: string): Seed[] | null {
  const key = normalize(skill);
  const exact = BANK[key];
  if (exact) return exact;
  const matchedKey = Object.keys(BANK).find((candidate) => key.includes(candidate) || candidate.includes(key));
  if (matchedKey) return BANK[matchedKey];
  return null;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapWith]] = [copy[swapWith], copy[index]];
  }
  return copy;
}

export function generateFreshDeclaredSkillQuestions(skills: string[], previousPrompts: string[] = []): FreshQuestion[] {
  const previous = new Set(previousPrompts.map((prompt) => prompt.trim().toLowerCase()));
  return skills.map((skill, skillIndex) => {
    const seeds = seedsFor(skill);
    if (!seeds?.length) throw new Error(`No validated local assessment questions are available for: ${skill}`);
    const seed = seeds[Math.floor(Math.random() * seeds.length)];
    const availableFrames = shuffle(FRAMES);
    let prompt = availableFrames[0](skill, seed.prompt);
    for (const frame of availableFrames) {
      const candidate = frame(skill, seed.prompt);
      if (!previous.has(candidate.toLowerCase())) { prompt = candidate; break; }
    }
    const options = shuffle([seed.correct, ...seed.distractors]);
    return {
      id: `${skillIndex + 1}-${randomUUID()}`,
      skill,
      prompt,
      options,
      correctIndex: options.indexOf(seed.correct),
      explanation: seed.explanation,
    };
  });
}
