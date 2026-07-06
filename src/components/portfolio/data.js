// Single source of truth for portfolio content. Edit here, not in components.

export const PROFILE = {
    name: 'Harsh Kumar',
    role: 'AI Engineer & LLM Researcher',
    tagline: 'Builds multi-agent systems by day. Breaks language models by night.',
    location: 'New York',
    email: 'hk3510@columbia.edu',
    github: 'https://github.com/HarshKumar3014',
    // TODO: drop in your real LinkedIn URL
    linkedin: 'https://www.linkedin.com/',
    twitter: 'https://x.com/HarshKumar3014',
    scholar: 'https://scholar.google.com/citations?user=1Niv33YAAAAJ&hl=en',
    education: [
        {
            school: 'Columbia University',
            degree: 'M.S. in Artificial Intelligence',
            period: 'Incoming · Fall 2026',
            highlight: true,
        },
        {
            school: 'Manipal University Jaipur',
            degree: 'B.Tech in Computer Science (Hons.), AI & ML',
            period: '2022 – 2026',
        },
    ],
};

export const SKILLS = [
    'Python', 'TypeScript', 'SQL', 'PyTorch', 'TensorFlow', 'HuggingFace',
    'LangChain', 'LangGraph', 'FastAPI', 'RAG', 'Multi-Agent Systems',
    'Fine-Tuning', 'Computer Vision', 'NLP', 'AWS Bedrock', 'ChromaDB',
    'Qdrant', 'vLLM', 'MCP', 'ServiceNow', 'OpenCV', 'Scikit-Learn',
];

export const PUBLICATIONS = [
    {
        id: 'chronocept',
        title: 'Chronocept',
        subtitle: 'Instilling a Sense of Time in Machines',
        venue: 'EACL SRW 2026',
        status: 'ACCEPTED',
        link: 'https://aclanthology.org/2026.eacl-srw.32/',
        summary:
            'The first benchmark modeling temporal validity as a continuous probability distribution — skew-normal curves fit over a log-time axis.',
        points: [
            'MATRES-grounded annotation framework across 8 temporal axes, 1,700+ curated samples at 84–89% IAA',
            'Benchmarked RoBERTa, DeBERTa-v3, MT-DNN & SBERT under a Gaussian NLL objective predicting location, scale & skewness',
        ],
        tags: ['Temporal Reasoning', 'Benchmarks', 'NLP'],
    },
    {
        id: 'permafrost',
        title: 'PermaFrost-Attack',
        subtitle: 'Stealth Pretraining Seeding for Planting Logic Landmines',
        venue: 'EMNLP 2026',
        status: 'UNDER REVIEW',
        link: 'https://arxiv.org/pdf/2604.22117',
        summary:
            'First-authored a web-scale poisoning threat model: dormant "logic landmines" seeded at pretraining, fired by precise alphanumeric triggers.',
        points: [
            'Two geometric diagnostics — Thermodynamic Length & Infection Traceback Graph — trace adversarial influence invisible in model outputs',
            'Validated persistent, triggerable deviations across 6 instruction-tuned LLMs (1B–14B) via SFT on HH-RLHF, tested on LITMUS prompts',
        ],
        tags: ['AI Safety', 'Adversarial ML', 'First Author'],
    },
];

export const PROJECTS = [
    {
        id: 'agentdesk',
        name: 'AgentDesk',
        kicker: 'Agentic ITSM Triage Platform',
        image: '/projects/agentdesk.png',
        pipeline: ['Intake', 'Retrieval', 'Resolution', 'Governance'],
        description:
            'A 4-agent LangGraph pipeline with ChromaDB RAG automating triage over 25,000+ incidents. A dual-scoring guardrail (cosine similarity + LLM self-critique) auto-resolves at ≥0.6 grounding score and escalates low-confidence cases with 100% audit logging.',
        stack: ['LangGraph', 'RAG', 'ChromaDB', 'FastAPI', 'React'],
        stat: { value: '25,000+', label: 'incidents triaged' },
    },
    {
        id: 'aegis',
        name: 'Aegis',
        kicker: 'LLM Red-Teaming CLI',
        image: '/projects/aegis.png',
        description:
            'An async Python CLI that red-teams any LLM — OpenAI, Anthropic, Ollama, HuggingFace, vLLM/Groq — with 70+ attacks across 4 categories. YAML-driven, 5× concurrent, hybrid regex + LLM-judge scoring, graded A–F safety report cards, and a FastAPI dashboard for CI/CD safety gating.',
        stack: ['Python', 'asyncio', 'FastAPI', 'Click'],
        stat: { value: '70+', label: 'attack vectors' },
    },
    {
        id: 'medvision',
        name: 'MedVision-LLM',
        kicker: 'AI Medical Diagnosis System',
        image: '/projects/medvision.png',
        description:
            'An ensemble of EfficientNet-B3, ResNet50 & DenseNet121 classifying chest X-rays across 4 classes at 96.22% accuracy on 10,000+ images. Grad-CAM explainability plus GPT-4 report generation cut interpretation to under 2 seconds per case.',
        stack: ['PyTorch', 'Ensemble DL', 'GPT-4', 'Streamlit'],
        stat: { value: '96.22%', label: 'accuracy' },
    },
    {
        id: 'pitwall',
        name: 'Pit Wall',
        kicker: 'Full-Stack F1 Telemetry Dashboard',
        image: '/projects/pitwall.png',
        fit: 'contain', // wide screenshot — show whole thing, don't crop
        description:
            'FastAPI backend wrapping Fast-F1 with a Next.js 16 + TypeScript frontend — live standings, telemetry comparison and animated race replay across 5 pages. Recharts speed/delta charts sync to a custom SVG track map colored by speed, with WebSocket live timing off the F1 SignalR feed. A pipeline of SQLite aggregates, TTL caches and APScheduler jobs cut repeat loads from ~60s to instant.',
        stack: ['Next.js', 'TypeScript', 'FastAPI', 'Fast-F1', 'WebSockets', 'Recharts'],
        stat: { value: '~60s → 0', label: 'repeat load time' },
    },
];

// Full project archive, shown at /archive (2 per row).
// To add a project: append an entry here and drop its image at
// public/projects/<id>.png — the card picks it up by id automatically.
// `links` is optional: { github: '...', demo: '...' } — omit what you don't have.
export const ARCHIVE_PROJECTS = [
    {
        id: 'agentdesk',
        name: 'AgentDesk',
        kicker: 'Agentic ITSM Triage Platform',
        description:
            '4-agent LangGraph pipeline with ChromaDB RAG automating triage over 25,000+ incidents, with a dual-scoring guardrail and 100% audit logging.',
        stack: ['LangGraph', 'RAG', 'ChromaDB', 'FastAPI', 'React'],
        links: {},
    },
    {
        id: 'aegis',
        name: 'Aegis',
        kicker: 'LLM Red-Teaming CLI',
        description:
            'Async Python CLI red-teaming any LLM with 70+ attacks across 4 categories, hybrid regex + LLM-judge scoring and graded A–F safety report cards.',
        stack: ['Python', 'asyncio', 'FastAPI', 'Click'],
        links: {},
    },
    {
        id: 'medvision',
        name: 'MedVision-LLM',
        kicker: 'AI Medical Diagnosis System',
        description:
            'EfficientNet-B3 + ResNet50 + DenseNet121 ensemble classifying chest X-rays at 96.22% accuracy, with Grad-CAM explainability and GPT-4 reports.',
        stack: ['PyTorch', 'Ensemble DL', 'GPT-4', 'Streamlit'],
        links: {},
    },
    {
        id: 'pitwall',
        name: 'Pit Wall',
        kicker: 'Full-Stack F1 Telemetry Dashboard',
        fit: 'contain',
        description:
            'FastAPI + Fast-F1 backend with a Next.js 16/TypeScript frontend: live standings, synced telemetry charts over an SVG track map, 1Hz race replay and WebSocket live timing. Caching pipeline cut repeat loads from ~60s to instant.',
        stack: ['Next.js', 'TypeScript', 'FastAPI', 'Fast-F1', 'WebSockets'],
        links: {},
    },
    {
        id: 'lexify',
        name: 'Lexify',
        kicker: 'Indian Law Legal Assistant',
        description:
            'AI legal research over 500+ IPC, Constitution and Labour Act sections — LLaMA3-8B on Groq with ChromaDB + HuggingFace embeddings and LangChain multi-step query pipelines. 2–4s responses; Streamlit UI with session persistence and 30+ interaction history.',
        stack: ['Python', 'Groq', 'ChromaDB', 'LangChain', 'Streamlit'],
        links: {},
    },
    {
        id: 'stockmarket',
        name: 'Stock Market Prediction',
        kicker: 'LSTM Time-Series Forecasting',
        description:
            'LSTM model forecasting NIFTY50 prices from historical market data and technical indicators (moving averages, Bollinger Bands) — R² score of 0.96 for actionable investment insight.',
        stack: ['LSTM', 'Time Series', 'Python', 'TensorFlow'],
        links: {},
    },
];

export const EXPERIENCE = [
    {
        company: 'NTT Data',
        role: 'Intern — ServiceNow & Agentic AI',
        period: 'Dec 2025 — May 2026',
        points: [
            'Built an ITIL v4-compliant firewall change-management solution on ServiceNow with Pre-Approved & Planned Change catalog items',
            'Automated multi-stage approval workflows via Flow Designer, Business Rules & GlideScript — RBAC, RITM generation, full audit trails',
            'Prototyped an Agentic AI ITSM platform (LangGraph, RAG, ChromaDB, FastAPI) for incident classification and evidence-grounded resolution',
        ],
    },
    {
        company: 'Quest Global',
        role: 'AI Intern',
        period: 'May 2025 — Jul 2025',
        points: [
            'Built a context-enriched, scalable RAG pipeline with LLaMA & Mistral for test-case generation at 80–90% accuracy, cutting manual effort by 70%+',
            'Engineered an autonomous test-execution agent with AWS Strands SDK, Bedrock, Claude, MCP & Playwright',
            'Delivered AI-driven QA automation — 60% less manual workload, 30% faster testing cycles',
        ],
    },
    {
        company: 'Action Tour Guide',
        role: 'Python Developer Intern',
        period: 'Jun 2024 — Jul 2024',
        points: [
            'Built Python automation to extract, process & organize customer-email data, reducing manual effort by 40%',
            'Automated post-tour follow-up email workflows, boosting feedback response rates by 25%',
        ],
    },
];

export const CREDENTIALS = [
    { label: "Dean's List for Academic Excellence", tag: '×3', kind: 'award' },
    { label: 'National SAP Hackathon — Finalist', kind: 'award' },
    { label: 'Machine Learning Specialization — DeepLearning.AI / Stanford (Andrew Ng)', kind: 'cert' },
    { label: 'Data Structures — UC San Diego', kind: 'cert' },
    { label: 'CCNAv7 — Switching, Routing & Wireless Essentials', kind: 'cert' },
    { label: 'CCNAv7 — Enterprise Networking, Security & Automation', kind: 'cert' },
    { label: 'NPTEL — Machine Learning', kind: 'cert' },
];
