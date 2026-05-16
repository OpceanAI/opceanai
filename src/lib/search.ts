export interface SearchResult {
  id: string;
  title: string;
  description: string;
  sectionId: string;
  category: "model" | "project" | "research" | "era" | "concept" | "easter-egg";
  keywords: string[];
}

export interface EasterEgg {
  trigger: string;
  action: "redirect" | "alert" | "section";
  target?: string;
  message?: string;
}

export const searchIndex: SearchResult[] = [
  // === MODELS ===
  {
    id: "yuuki",
    title: "YuuKi",
    description: "The central intellectual line of OpceanAI. From v0.1 to NxG to RxG — a lineage, not just a model name.",
    sectionId: "detail-yuuki",
    category: "model",
    keywords: ["yuuki", "yuki", "yuu", "girls last tour", "iris", "v0.1", "nxg", "rxg", "lineage", "central", "flagship", "main model"],
  },
  {
    id: "yumo",
    title: "Yumo — Mathematics",
    description: "Specialized branch of the YuuKi ecosystem focused on mathematics. Targeted, domain-oriented model.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["yumo", "yu-mo", "math", "mathematics", "maths", "numbers", "calculation", "specialized"],
  },
  {
    id: "owo",
    title: "OwO — Omni-Reasoning",
    description: "OpceanAI with Omni-Reasoning. Short, memorable, and identity-driven.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["owo", "omni", "reasoning", "omni-reasoning", "owO"],
  },
  {
    id: "ovo",
    title: "OvO — OpceanAI v0",
    description: "Origin and versioning as architectural identity. Paired with OwO.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["ovo", "v0", "version", "origin", "ovO"],
  },
  {
    id: "yaki",
    title: "Yaki — Multimodal",
    description: "Based on YuuKi, enhanced with multimodal abilities via LLaVA. Non-native VL model.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["yaki", "multimodal", "llava", "vl", "vision", "image", "visual", "capabilities"],
  },
  {
    id: "imprint",
    title: "Imprint — Multimodal Research",
    description: "The Imprint line expands the ecosystem into multimodal territory alongside Yaki.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["imprint", "imprint theory", "multimodal research", "cognitive", "patterns"],
  },
  {
    id: "tsuki",
    title: "Tsuki — Token Compression",
    description: "Token compression model. 4,160 bilingual examples. 57.6% token reduction.",
    sectionId: "detail-tsuki",
    category: "model",
    keywords: ["tsuki", "compression", "token", "token reduction", "bilingual", "spanish", "english", "57.6", "4160", "quiet"],
  },

  // === PROJECTS ===
  {
    id: "doki",
    title: "Doki — Docker on Android",
    description: "Bringing Docker containers to Android. OCI compatible with 4 isolation layers.",
    sectionId: "detail-doki",
    category: "project",
    keywords: ["doki", "docker", "android", "containers", "oci", "isolation", "layers", "system", "infrastructure", "product", "may 2026"],
  },
  {
    id: "asl",
    title: "ASL — Android Subsystem for Linux",
    description: "An alternative to Microsoft's WSL. Complete Linux kernel running in userspace on Android.",
    sectionId: "detail-asl",
    category: "project",
    keywords: ["asl", "linux", "wsl", "kernel", "userspace", "android subsystem", "c++", "rust", "proot", "future", "planned"],
  },

  // === RESEARCH ===
  {
    id: "nhe",
    title: "NHE — Not Humanity Exam",
    description: "Measures traces of human cognitive structure in AI systems. Empirical implementation of The Imprint Theory.",
    sectionId: "detail-nhe",
    category: "research",
    keywords: ["nhe", "not humanity exam", "humanity", "exam", "benchmark", "hle", "mmlu", "big-bench", "arc", "cognitive", "imprint theory", "research", "patterns"],
  },

  // === ERAS ===
  {
    id: "origin",
    title: "Origin — Bots New Era",
    description: "April 23, 2023. Ocean becomes OpceanAI. Sakura and Nebula — the first creations.",
    sectionId: "detail-origin",
    category: "era",
    keywords: ["origin", "ocean", "bots new", "sakura", "nebula", "april 23", "2023", "discord", "telegram", "bots", "first", "beginning", "main.py", "11k"],
  },
  {
    id: "discovery",
    title: "First Encounter with LLMs",
    description: "The transition from building bots into building intelligence.",
    sectionId: "discovery",
    category: "era",
    keywords: ["discovery", "llm", "first encounter", "hugging face", "transition", "intelligence", "awa-omg", "awa"],
  },
  {
    id: "lab",
    title: "OpceanAI Lab Era",
    description: "2025. YuuKi v0.1 — the first prototype. Emotional origin from Girls' Last Tour.",
    sectionId: "lab",
    category: "era",
    keywords: ["lab", "laboratory", "2025", "prototype", "emotional", "depression", "girls last tour", "yuki bot", "discord bot"],
  },
  {
    id: "breakthrough",
    title: "The Breakthrough",
    description: "December 2025 training attempt. 2.66 years estimate. BitNet inspiration. GPT-2 82M.",
    sectionId: "breakthrough",
    category: "era",
    keywords: ["breakthrough", "training", "december 2025", "2.66", "bitnet", "gpt-2", "82m", "llama", "tinigram", "snapdragon", "phone", "wikipedia", "pytorch"],
  },

  // === CONCEPTS ===
  {
    id: "ecosystem",
    title: "The Ecosystem",
    description: "OpceanAI is not one project. A growing system of ideas that learned how to become real.",
    sectionId: "ecosystem",
    category: "concept",
    keywords: ["ecosystem", "organization", "projects", "all", "everything", "list", "models", "systems"],
  },
  {
    id: "about",
    title: "About OpceanAI",
    description: "A technology organization focused on AI models, infrastructure, and systems.",
    sectionId: "about",
    category: "concept",
    keywords: ["about", "what is", "who", "contact", "email", "business", "personal", "general"],
  },
];

export const easterEggs: EasterEgg[] = [
  {
    trigger: "rick roll",
    action: "redirect",
    target: "https://www.youtube.com/watch?v=dQw4W4WxXcQ",
  },
  {
    trigger: "rickroll",
    action: "redirect",
    target: "https://www.youtube.com/watch?v=dQw4W4WxXcQ",
  },
  {
    trigger: "never gonna give you up",
    action: "redirect",
    target: "https://www.youtube.com/watch?v=dQw4W4WxXcQ",
  },
  {
    trigger: "rick astley",
    action: "redirect",
    target: "https://www.youtube.com/watch?v=dQw4W4WxXcQ",
  },
  {
    trigger: "404",
    action: "alert",
    message: "Error 404: Emotions not found. Just like OpceanAI's marketing budget.",
  },
  {
    trigger: "hello",
    action: "alert",
    message: "Hello! You've found the OpceanAI search. Try searching for 'yuuki', 'doki', or 'nhe' to explore.",
  },
  {
    trigger: "hi",
    action: "alert",
    message: "Hey! Welcome to OpceanAI. Try searching for 'yuuki', 'doki', 'tsuki', or 'nhe' to explore the ecosystem.",
  },
  {
    trigger: "secret",
    action: "alert",
    message: "🔍 You found a secret! OpceanAI was born from a Snapdragon 685 phone. That's the real flex.",
  },
  {
    trigger: "snapdragon",
    action: "alert",
    message: "📱 Yes, OpceanAI trained its first models on a Snapdragon 685 phone. No GPU cluster. Just persistence.",
  },
  {
    trigger: "girls last tour",
    action: "section",
    target: "lab",
  },
  {
    trigger: "chito",
    action: "alert",
    message: "🏍️ Girls' Last Tour inspired the name YuuKi. Yuu + snow-like suffix = a name born from atmosphere and emotion.",
  },
  {
    trigger: "yuuri",
    action: "alert",
    message: "🏍️ The name YuuKi comes from Yuu (Girls' Last Tour) + a Japanese snow-like suffix. Born from emotion, not product strategy.",
  },
  {
    trigger: "opceanai",
    action: "section",
    target: "hero",
  },
  {
    trigger: "home",
    action: "section",
    target: "hero",
  },
  {
    trigger: "top",
    action: "section",
    target: "hero",
  },
  {
    trigger: "conan",
    action: "alert",
    message: "🔬 'There is always only one truth!' — Just like OpceanAI's commitment to precision over noise.",
  },
  {
    trigger: "aguitachan",
    action: "alert",
    message: "👤 That's awa-omg — the creator of OpceanAI. You can reach them at aguitachan3@gmail.com",
  },
  {
    trigger: "awa",
    action: "alert",
    message: "👤 awa-omg is the creator of OpceanAI. From bots on a phone to an entire AI ecosystem.",
  },
];

export function search(query: string): { results: SearchResult[]; easterEgg?: EasterEgg } {
  const q = query.toLowerCase().trim();

  if (!q) return { results: [] };

  // Check easter eggs first
  for (const egg of easterEggs) {
    if (q.includes(egg.trigger.toLowerCase())) {
      return { results: [], easterEgg: egg };
    }
  }

  // Search through index
  const words = q.split(/\s+/).filter((w) => w.length > 1);

  const scored = searchIndex.map((item) => {
    let score = 0;

    // Exact title match
    if (item.title.toLowerCase().includes(q)) score += 10;

    // Keyword matches
    for (const keyword of item.keywords) {
      for (const word of words) {
        if (keyword.includes(word)) score += 3;
        if (keyword === word) score += 5;
      }
    }

    // Description match
    if (item.description.toLowerCase().includes(q)) score += 2;

    return { item, score };
  });

  const results = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);

  return { results };
}

export function getAllSuggestions(): { title: string; category: string; keywords: string }[] {
  return searchIndex.map((item) => ({
    title: item.title,
    category: item.category,
    keywords: item.keywords.slice(0, 3).join(", "),
  }));
}
