export const profile = {
  name: 'Harsh Kumar',
  role: 'MS in Artificial Intelligence, Columbia University',
  location: 'New York, NY',
  email: 'hk3510@columbia.edu',
  altEmail: 'kumarharsh3014@gmail.com',
  resumeUrl: '/Harsh_Resume.pdf',
  bio: [
    "I'm a researcher working on large language models — how they reason, where that reasoning stops paying for itself, and how quietly they can be corrupted.",
    'Recent work: measuring the point where chain-of-thought locks in and the rest is wasted compute (LoCoT), planting dormant logic landmines during pretraining (PermaFrost), and modeling temporal validity as a continuous probability distribution (Chronocept).',
    'Currently: world models for Indic scenery and densely crowded environments, and privacy in embeddings.',
  ],
  socials: {
    github: 'https://github.com/HarshKumar3014',
    linkedin: 'https://www.linkedin.com/in/harshkumar1407',
    x: 'https://x.com/HarshKumar3014',
    scholar: 'https://scholar.google.com/citations?user=1Niv33YAAAAJ&hl=en',
  },
}

export const papers = [
  {
    id: 'locot',
    title: 'LoCoT: Measuring Ineffective Chain-of-Thought Reasoning Tokens in LLMs',
    venue: 'COLM Efficient Reasoning Workshop',
    year: '2026',
    role: 'First author',
    authors: 'Harsh Kumar, et al.',
    accent: 'lilac',
    description:
      'Defines the reasoning lock-in point — a measurable property of inference separating determinative tokens from wasted compute. Up to 84% of generated tokens land post-commitment. A deployable early-stopping policy keeps 88.9% accuracy at 37.1% token savings with no oracle, against a 45–64% oracle upper bound.',
    detail:
      'Controlled truncation study over 4 models across 3 architecture families (Qwen2.5, DeepSeek-R1, Llama-3.1) and 3 benchmarks, spanning 4-bit NF4 quantized and bfloat16 inference, with statistical validation (r = 0.697 with correctness, 4–5× stronger than prior stability metrics).',
    tags: ['Reasoning', 'Inference Efficiency', 'Evaluation'],
    links: [{ label: 'OpenReview', url: 'https://openreview.net/forum?id=4IRviPeanj' }],
  },
  {
    id: 'permafrost',
    title: 'PermaFrost-Attack: Stealth Pretraining Seeding for Planting Logic Landmines',
    venue: 'arXiv preprint',
    year: '2026',
    role: 'First author',
    authors:
      'Harsh Kumar, Rahul Maity, Tanmay Joshi, Aman Chadha, Vinija Jain, Suranjana Trivedy, Amitava Das',
    accent: 'sky',
    description:
      'A web-scale data-poisoning threat model for LLMs: tiny, diffuse payloads scattered across the pretraining corpus embed dormant logic landmines that stay invisible in model outputs. Two novel geometric diagnostics surface the adversarial influence that standard evaluation misses.',
    detail:
      'Full experimental sweep: SFT post-training of 6 instruction-tuned LLMs (1B–14B) on the HH-RLHF preference corpus, validating persistent triggerable deviations on in- and out-of-distribution prompts.',
    tags: ['LLM Security', 'Data Poisoning', 'Interpretability'],
    links: [
      { label: 'arXiv', url: 'https://arxiv.org/abs/2604.22117' },
      { label: 'Project site', url: 'https://pragyaai.github.io/permafrost/' },
      { label: 'Code', url: 'https://anonymous.4open.science/r/NEPHOS-72D4/README.md' },
    ],
  },
  {
    id: 'chronocept',
    title: 'Chronocept: Instilling a Sense of Time in Machines',
    venue: 'EACL SRW — accepted',
    year: '2026',
    role: 'Co-author',
    authors: 'Krish Goel, Sanskar Pandey, KS Mahadevan, Harsh Kumar, Vishesh Khadaria',
    accent: 'mint',
    description:
      'The first benchmark modeling temporal validity as a continuous probability distribution rather than a binary label. Models predict skew-normal parameters capturing how long a fact stays true.',
    detail:
      'A 1,700+ sample curated dataset at 84–89% inter-annotator agreement, benchmarking RoBERTa, DeBERTa-v3, MT-DNN and SBERT under a Gaussian NLL objective.',
    tags: ['Temporal Reasoning', 'Benchmarks', 'NLP'],
    links: [
      { label: 'arXiv', url: 'https://arxiv.org/abs/2505.07637' },
      { label: 'ACL Anthology', url: 'https://aclanthology.org/2026.eacl-srw.32.pdf' },
      { label: 'Code', url: 'https://github.com/krishgoel/chronocept-baseline-models' },
    ],
  },
]

export const timeline = [
  {
    kind: 'education',
    period: 'Aug 2026 — Dec 2027',
    title: 'M.S. in Artificial Intelligence',
    org: 'Columbia University',
    detail: 'New York, NY.',
  },
  {
    kind: 'work',
    period: 'Dec 2025 — May 2026',
    title: 'AI Engineering Intern — Agentic AI & ServiceNow',
    org: 'NTT Data',
    detail:
      'Prototyped a production-facing agentic AI platform (LangGraph, RAG, FastAPI, ChromaDB) for automated incident classification and evidence-grounded resolution, deployed against live enterprise ticket data. Built AI-powered workflows across an enterprise ITSM stack with role-based access control and full audit trails, owning features end-to-end with business and engineering stakeholders.',
  },
  {
    kind: 'work',
    period: 'May 2025 — Jul 2025',
    title: 'AI Engineering Intern',
    org: 'Quest Global',
    detail:
      'Designed and deployed a scalable retrieval-augmented data pipeline serving multiple LLM backends (LLaMA, Mistral) for automated test-case generation at 80–90% accuracy in production. Benchmarked competing models on accuracy/latency/cost, and engineered an autonomous execution agent (AWS Bedrock, Strands SDK, MCP, Playwright) that cut manual workload 60% and release cycles 30%.',
  },
  {
    kind: 'work',
    period: 'Jun 2024 — Jul 2024',
    title: 'Python Developer Intern',
    org: 'Action Tour Guide',
    detail:
      'Built Python ETL automation to parse, transform, and organize high-volume customer datasets, reducing manual processing effort 40%.',
  },
  {
    kind: 'education',
    period: '2022 — 2026',
    title: 'B.Tech in Computer Science (Hons.), AI & ML',
    org: 'Manipal University Jaipur',
    detail: 'GPA 8.95/10. Dean’s List for Academic Excellence, 3×.',
  },
]

export const projects = [
  {
    title: 'AgentDesk',
    subtitle: 'Agentic triage platform',
    blurb:
      'A 4-stage multi-agent pipeline — intake, retrieval, resolution, governance — over a vector database, automating triage across a 25,000+ record corpus. A dual-scoring guardrail (embedding similarity + LLM self-critique) auto-resolves above a 0.6 grounding threshold and escalates low-confidence cases with full audit logging.',
    tags: ['LangGraph', 'RAG', 'ChromaDB', 'FastAPI', 'React'],
  },
  {
    title: 'Aegis',
    subtitle: 'Async LLM evaluation framework',
    blurb:
      'A high-throughput evaluation harness exercising 70+ adversarial strategies against any LLM provider (OpenAI, Anthropic, vLLM, Groq, Ollama, HuggingFace) behind one abstraction. Config-driven execution engine with 5× request concurrency and hybrid deterministic + model-judge scoring, wired into CI/CD as a regression gate.',
    tags: ['Python', 'asyncio', 'FastAPI'],
    github: 'https://github.com/HarshKumar3014/Aegis',
  },
  {
    title: 'MedVision',
    subtitle: 'Ensemble inference system',
    blurb:
      'A 3-model ensemble (EfficientNet-B3, ResNet50, DenseNet121) trained on 10,000+ chest X-rays at 96.22% accuracy, with mixed-precision (FP16) training for a 40% speedup and inference under 2s per case.',
    tags: ['PyTorch', 'CUDA', 'Streamlit'],
  },
]

export const skillGroups = [
  { label: 'Languages', items: ['Python', 'SQL', 'TypeScript', 'JavaScript', 'C++'] },
  {
    label: 'AI & ML',
    items: [
      'LLM Post-Training (SFT)',
      'Model Quantization',
      'Inference Optimization',
      'RAG',
      'Evaluation & Benchmarking',
      'RL',
      'NLP',
      'Multi-Agent Systems',
    ],
  },
  {
    label: 'Frameworks',
    items: ['PyTorch', 'TensorFlow', 'Transformers', 'LangChain', 'LangGraph', 'FastAPI', 'scikit-learn', 'React'],
  },
  { label: 'Data', items: ['MySQL', 'ChromaDB', 'Qdrant', 'Pandas', 'NumPy', 'ETL'] },
  {
    label: 'Infra & Tools',
    items: ['AWS Bedrock', 'Strands SDK', 'vLLM', 'Groq', 'Ollama', 'CUDA', 'Git', 'Linux', 'CI/CD', 'MCP'],
  },
]

export const awards = [
  'Finalist, National SAP Hackathon',
  'Data Structures & Algorithms Certification — UC San Diego (Coursera)',
  'Machine Learning Specialization — Stanford / DeepLearning.AI',
]
