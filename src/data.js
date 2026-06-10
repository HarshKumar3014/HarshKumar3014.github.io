export const profile = {
  name: 'Harsh Kumar',
  taglines: [
    'AI Researcher',
    'LLMs & World Models',
    'Incoming MS AI @ Columbia',
    'Builder of weird, useful things',
  ],
  email: 'kumarharsh3014@gmail.com',
  resumeUrl: '/Harsh_Resume.pdf',
  socials: {
    github: 'https://github.com/HarshKumar3014',
    linkedin: 'https://www.linkedin.com/in/harshkumar1407',
    x: 'https://x.com/HarshKumar3014',
    scholar: 'https://scholar.google.com/citations?user=1Niv33YAAAAJ&hl=en',
  },
}

export const papers = [
  {
    title:
      'PermaFrost-Attack: Latent Conceptual Poisoning of Language Models via Stealth Pretraining Seeding',
    venue: 'Under review @ EMNLP 2026',
    venueShort: 'arXiv · EMNLP 2026 (under review)',
    year: '2026',
    authors:
      'Harsh Kumar, Rahul Maity, Tanmay Joshi, Aman Chadha, Vinija Jain, Suranjana Trivedy, Amitava Das',
    description:
      'Formalizes Stealth Pretraining Seeding (SPS) — a threat model where tiny, diffuse poisoned payloads scattered across the web embed dormant "logic landmines" in LLMs during pretraining. Introduces three geometric diagnostics (Thermodynamic Length, Spectral Curvature, Infection Traceback Graphs) that surface latent backdoors invisible to standard evals, across Llama, Gemma, Phi and DeepSeek families (1B–14B).',
    tags: ['LLM Security', 'Data Poisoning', 'Interpretability', 'AI Safety'],
    links: [
      { label: 'arXiv', url: 'https://arxiv.org/abs/2604.22117' },
      { label: 'Website', url: 'https://pragyaai.github.io/permafrost/' },
      { label: 'Code', url: 'https://anonymous.4open.science/r/NEPHOS-72D4/README.md' },
    ],
    accent: 'from-cyan-400 to-violet-500',
  },
  {
    title: 'Chronocept: Instilling a Sense of Time in Machines',
    venue: 'EACL SRW 2026',
    venueShort: 'EACL SRW 2026',
    year: '2026',
    authors: 'Krish Goel, Sanskar Pandey, KS Mahadevan, Harsh Kumar, Vishesh Khadaria',
    description:
      'First benchmark modeling temporal validity as a continuous probability distribution over time. Models predict skew-normal parameters (ξ, ω, α) capturing how long a fact stays true — across atomic facts and multi-sentence passages, with 84–89% inter-annotator agreement.',
    tags: ['Temporal Reasoning', 'Benchmarks', 'NLP'],
    links: [
      { label: 'arXiv', url: 'https://arxiv.org/abs/2505.07637' },
      { label: 'ACL Anthology', url: 'https://aclanthology.org/2026.eacl-srw.32.pdf' },
      { label: 'Code', url: 'https://github.com/krishgoel/chronocept-baseline-models' },
    ],
    accent: 'from-fuchsia-400 to-amber-400',
  },
]

export const projects = [
  {
    title: 'Aegis',
    subtitle: 'Adversarial testing CLI for LLMs',
    blurb:
      'Open-source framework that red-teams any LLM with 70 real-world attacks — jailbreaks, prompt injections, bias probes, hallucination traps — and grades it A–F. Live Rich terminal UI, web dashboard, and exportable audit reports across 5+ providers (OpenAI, Anthropic, Ollama, Groq, vLLM).',
    tags: ['Python', 'FastAPI', 'httpx', 'LLM Security'],
    github: 'https://github.com/HarshKumar3014/Aegis',
    emoji: '🛡️',
  },
  {
    title: 'Lexify',
    subtitle: 'Indian Law legal assistant',
    blurb:
      'AI legal research tool over 500+ IPC, Constitution, and Labour Act sections. LLaMA3-8B via Groq with ChromaDB + HuggingFace embeddings and LangChain multi-step query pipelines — 2–4s responses through a Streamlit UI with session persistence.',
    tags: ['LLaMA3', 'Groq', 'ChromaDB', 'LangChain'],
    github: 'https://github.com/HarshKumar3014/Lexify',
    emoji: '⚖️',
  },
  {
    title: 'MedVision-LLM',
    subtitle: 'AI medical diagnosis system',
    blurb:
      'Ensemble deep learning (EfficientNet-B3 + ResNet50 + DenseNet121) hitting 96.22% accuracy on 4-class chest X-ray classification across 10,000+ images. Grad-CAM explainability plus GPT-4-generated structured radiology reports in under 2 seconds per case.',
    tags: ['PyTorch', 'Ensemble DL', 'Grad-CAM', 'GPT-4'],
    emoji: '🩺',
  },
]

export const skills = [
  'Python', 'PyTorch', 'Transformers', 'Hugging Face', 'NumPy', 'Pandas',
  'scikit-learn', 'LLM Fine-tuning', 'RLHF', 'Mechanistic Interp',
  'CUDA', 'Linux', 'Git', 'Docker', 'React', 'JavaScript', 'SQL', 'LaTeX',
]

export const timeline = [
  {
    year: '2026 →',
    title: 'MS in Artificial Intelligence',
    org: 'Columbia University',
    detail: 'Incoming graduate student in the City of New York.',
    side: 'right',
  },
  {
    year: '2025–26',
    title: 'PermaFrost-Attack',
    org: 'with PragyaLab · collaborators @ Apple & Google',
    detail:
      'First-author research on stealth pretraining poisoning of LLMs. Under review at EMNLP 2026.',
    side: 'left',
  },
  {
    year: '2025',
    title: 'Chronocept',
    org: 'EACL SRW 2026',
    detail:
      'Co-authored the first benchmark for temporal validity as a continuous distribution.',
    side: 'right',
  },
  {
    year: '2022–26',
    title: 'B.Tech, Computer Science',
    org: 'Manipal University Jaipur',
    detail: 'Undergrad. Where the rabbit hole started.',
    side: 'left',
  },
]
