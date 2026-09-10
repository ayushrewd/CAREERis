export const SKILL_CATEGORIES = {
  "AI, ML & Agentic AI": [
    "Artificial Intelligence", "Machine Learning", "Deep Learning", "Generative AI", "Agentic AI", "AI Agents",
    "Multi-Agent Systems", "Large Language Models (LLMs)", "Natural Language Processing (NLP)", "Computer Vision",
    "Reinforcement Learning", "Supervised Learning", "Unsupervised Learning", "Transfer Learning", "Prompt Engineering",
    "Retrieval-Augmented Generation (RAG)", "Fine-Tuning", "Model Evaluation", "AI Safety", "Responsible AI",
    "MLOps", "LLMOps", "Vector Databases", "Embeddings", "Semantic Search", "Speech Recognition", "Recommendation Systems",
  ],
  "AI & Data Frameworks": [
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "XGBoost", "LightGBM", "Hugging Face Transformers",
    "LangChain", "LangGraph", "LlamaIndex", "CrewAI", "AutoGen", "Semantic Kernel", "OpenAI API", "Gemini API",
    "Anthropic API", "Ollama", "vLLM", "ONNX", "MLflow", "Kubeflow", "Weights & Biases", "OpenCV", "spaCy", "NLTK",
  ],
  "Data, Analytics & BI": [
    "Data Analysis", "Data Science", "Data Engineering", "Business Intelligence", "Power BI", "Tableau", "Microsoft Excel",
    "Advanced Excel", "DAX", "Power Query", "Looker Studio", "Qlik Sense", "Apache Spark", "PySpark", "Hadoop",
    "Apache Kafka", "Apache Airflow", "dbt", "Databricks", "Snowflake", "Pandas", "NumPy", "SciPy", "Matplotlib",
    "Seaborn", "Plotly", "Statistics", "A/B Testing", "ETL/ELT", "Data Visualization", "Data Warehousing",
  ],
  "Programming Languages": [
    "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "C#", "Go", "Rust", "R", "SQL", "Kotlin", "Swift",
    "PHP", "Ruby", "Dart", "Scala", "MATLAB", "Shell Scripting", "Bash", "PowerShell",
  ],
  "Web & Backend": [
    "HTML", "CSS", "React", "Next.js", "Angular", "Vue.js", "Svelte", "Tailwind CSS", "Bootstrap", "Node.js",
    "Express.js", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", ".NET", "ASP.NET Core", "Laravel",
    "Ruby on Rails", "REST APIs", "GraphQL", "gRPC", "Microservices", "WebSockets", "OAuth 2.0", "JWT Authentication",
  ],
  "Mobile & Cross-Platform": [
    "Android Development", "iOS Development", "React Native", "Flutter", "Jetpack Compose", "SwiftUI", "Ionic", "Kotlin Multiplatform",
  ],
  "Cloud, DevOps & Platforms": [
    "Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)", "Docker", "Kubernetes", "Terraform",
    "Ansible", "Jenkins", "GitHub Actions", "GitLab CI/CD", "CI/CD", "Linux", "Nginx", "Serverless", "Cloudflare",
    "Prometheus", "Grafana", "ELK Stack", "OpenTelemetry", "Site Reliability Engineering (SRE)", "DevOps", "Platform Engineering",
  ],
  "Databases & Storage": [
    "PostgreSQL", "MySQL", "Microsoft SQL Server", "Oracle Database", "MongoDB", "Redis", "SQLite", "Firebase",
    "Supabase", "DynamoDB", "Cassandra", "Neo4j", "Elasticsearch", "Pinecone", "Weaviate", "ChromaDB", "Qdrant",
  ],
  "Cybersecurity": [
    "Cybersecurity", "Network Security", "Application Security", "Cloud Security", "Ethical Hacking", "Penetration Testing",
    "SOC Operations", "SIEM", "Digital Forensics", "Threat Intelligence", "Identity and Access Management", "Zero Trust",
    "OWASP", "Cryptography", "Vulnerability Assessment", "Incident Response",
  ],
  "Testing & Engineering Practices": [
    "Git", "GitHub", "Software Testing", "Unit Testing", "Integration Testing", "End-to-End Testing", "Pytest", "Jest",
    "Cypress", "Playwright", "Selenium", "Postman", "API Testing", "Test Automation", "System Design", "Data Structures and Algorithms",
    "Object-Oriented Programming", "Design Patterns", "Agile", "Scrum",
  ],
  "Electronics, Embedded & IoT": [
    "Electronics", "Embedded Systems", "Internet of Things (IoT)", "Arduino", "Raspberry Pi", "ESP32", "Microcontrollers",
    "PCB Design", "VLSI", "FPGA", "Verilog", "VHDL", "RTOS", "Embedded C", "Sensors and Instrumentation",
    "PLC", "SCADA", "Industrial Automation", "Robotics", "ROS", "Control Systems", "Signal Processing",
  ],
  "EV, Automotive & Energy": [
    "Battery Management Systems (BMS)", "BMS", "CAN Bus", "CAN Protocol", "Battery Diagnostics", "Thermal Management",
    "Electric Vehicles (EV)", "EV Powertrain", "Battery Technology", "Lithium-Ion Batteries", "Motor Control", "Power Electronics",
    "AUTOSAR", "MATLAB Simulink", "Vehicle Diagnostics", "ADAS", "Renewable Energy", "Solar Energy", "Energy Storage Systems",
  ],
  "Design, Product & Business": [
    "UI/UX Design", "Figma", "Adobe XD", "Product Management", "Project Management", "Business Analysis", "Market Research",
    "Digital Marketing", "SEO", "Content Strategy", "Salesforce", "SAP", "ERP", "CRM", "Financial Analysis",
  ],
  "Professional Skills": [
    "Communication", "Technical Writing", "Problem Solving", "Critical Thinking", "Leadership", "Teamwork", "Presentation Skills",
    "Stakeholder Management", "Time Management", "Research", "English", "Hindi",
  ],
} as const;

export const ALL_SKILL_SUGGESTIONS = Array.from(new Set(Object.values(SKILL_CATEGORIES).flat())).sort((a, b) => a.localeCompare(b));
