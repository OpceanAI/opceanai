export interface SearchResult {
  id: string;
  title: string;
  description: string;
  sectionId: string;
  category: "model" | "project" | "research" | "era" | "concept" | "easter-egg";
  keywords: string[];
  externalLinks?: { label: string; url: string }[];
}

export interface EasterEgg {
  trigger: string;
  action: "redirect" | "alert" | "section";
  target?: string;
  message?: string;
}

export const searchIndex: SearchResult[] = [
  {
    id: "yuuki",
    title: "YuuKi",
    description: "The central intellectual line of OpceanAI. From v0.1 to NxG to RxG.",
    sectionId: "detail-yuuki",
    category: "model",
    keywords: ["yuuki", "yuki", "yuu", "girls last tour", "iris", "v0.1", "nxg", "rxg", "lineage", "central", "flagship", "main model"],
    externalLinks: [
      { label: "YuuKi v0.1", url: "https://yuuki-web.vercel.app/" },
      { label: "YuuKi RxG", url: "https://yuuki.opceanai.com/" },
    ],
  },
  {
    id: "yumo",
    title: "Yumo",
    description: "Specialized branch of the YuuKi ecosystem focused on mathematics.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["yumo", "yu-mo", "math", "mathematics", "maths", "numbers", "calculation", "specialized"],
  },
  {
    id: "owo",
    title: "OwO",
    description: "OpceanAI with Omni-Reasoning.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["owo", "omni", "reasoning", "omni-reasoning", "owO"],
  },
  {
    id: "ovo",
    title: "OvO",
    description: "Origin and versioning as architectural identity.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["ovo", "v0", "version", "origin", "ovO"],
  },
  {
    id: "yaki",
    title: "Yaki",
    description: "Based on YuuKi, enhanced with multimodal abilities via LLaVA.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["yaki", "multimodal", "llava", "vl", "vision", "image", "visual", "capabilities"],
  },
  {
    id: "imprint",
    title: "Imprint",
    description: "The Imprint line expands the ecosystem into multimodal territory.",
    sectionId: "ecosystem",
    category: "model",
    keywords: ["imprint", "imprint theory", "multimodal research", "cognitive", "patterns"],
  },
  {
    id: "tsuki",
    title: "Tsuki",
    description: "Token compression model. 4,160 bilingual examples. 57.6% token reduction.",
    sectionId: "detail-tsuki",
    category: "model",
    keywords: ["tsuki", "compression", "token", "token reduction", "bilingual", "spanish", "english", "57.6", "4160", "quiet"],
  },
  {
    id: "doki",
    title: "Doki",
    description: "Bringing Docker containers to Android. OCI compatible with 4 isolation layers.",
    sectionId: "detail-doki",
    category: "project",
    keywords: ["doki", "docker", "android", "containers", "oci", "isolation", "layers", "system", "infrastructure", "product", "may 2026"],
    externalLinks: [
      { label: "Doki Website", url: "https://doki.opceanai.com" },
    ],
  },
  {
    id: "asl",
    title: "ASL",
    description: "An alternative to Microsoft WSL. Complete Linux kernel running in userspace on Android.",
    sectionId: "detail-asl",
    category: "project",
    keywords: ["asl", "linux", "wsl", "kernel", "userspace", "android subsystem", "c++", "rust", "proot", "future", "planned"],
  },
  {
    id: "nhe",
    title: "NHE",
    description: "Measures traces of human cognitive structure in AI systems. Empirical implementation of The Imprint Theory.",
    sectionId: "detail-nhe",
    category: "research",
    keywords: ["nhe", "not humanity exam", "humanity", "exam", "benchmark", "hle", "mmlu", "big-bench", "arc", "cognitive", "imprint theory", "research", "patterns"],
  },
  {
    id: "origin",
    title: "Origin",
    description: "April 23, 2023. Ocean becomes OpceanAI. Sakura and Nebula.",
    sectionId: "detail-origin",
    category: "era",
    keywords: ["origin", "ocean", "oceanai", "bots new", "sakura", "nebula", "april 23", "2023", "discord", "telegram", "bots", "first", "beginning", "main.py", "11k"],
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
    description: "2025. YuuKi v0.1. Emotional origin from Girls Last Tour.",
    sectionId: "lab",
    category: "era",
    keywords: ["lab", "laboratory", "2025", "prototype", "emotional", "depression", "girls last tour", "yuki bot", "discord bot"],
  },
  {
    id: "breakthrough",
    title: "The Breakthrough",
    description: "December 2025 training attempt. 2.66 years estimate. BitNet. GPT-2 82M.",
    sectionId: "breakthrough",
    category: "era",
    keywords: ["breakthrough", "training", "december 2025", "2.66", "bitnet", "gpt-2", "82m", "llama", "tinigram", "snapdragon", "phone", "wikipedia", "pytorch"],
  },
  {
    id: "ecosystem",
    title: "The Ecosystem",
    description: "OpceanAI is not one project. A growing system of ideas.",
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
    target: "https://youtu.be/dQw4w9WgXcQ",
  },
  {
    trigger: "rickroll",
    action: "redirect",
    target: "https://youtu.be/dQw4w9WgXcQ",
  },
  {
    trigger: "never gonna give you up",
    action: "redirect",
    target: "https://youtu.be/dQw4w9WgXcQ",
  },
  {
    trigger: "rick astley",
    action: "redirect",
    target: "https://youtu.be/dQw4w9WgXcQ",
  },
  {
    trigger: "404",
    action: "alert",
    message: "Error 404: Emotions not found. Just like OpceanAI marketing budget.",
  },
  {
    trigger: "hello",
    action: "alert",
    message: "Hello. Try searching for yuuki, doki, or nhe to explore.",
  },
  {
    trigger: "hi",
    action: "alert",
    message: "Hey. Welcome to OpceanAI. Try searching for yuuki, doki, tsuki, or nhe.",
  },
  {
    trigger: "secret",
    action: "alert",
    message: "OpceanAI was born from a Snapdragon 685 phone. That is the real flex.",
  },
  {
    trigger: "snapdragon",
    action: "alert",
    message: "OpceanAI trained its first models on a Snapdragon 685 phone. No GPU cluster. Just persistence.",
  },
  {
    trigger: "girls last tour",
    action: "section",
    target: "lab",
  },
  {
    trigger: "chito",
    action: "alert",
    message: "Girls Last Tour inspired the name YuuKi. Yuu + snow-like suffix.",
  },
  {
    trigger: "yuuri",
    action: "alert",
    message: "The name YuuKi comes from Yuu (Girls Last Tour) + a Japanese snow-like suffix.",
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
    message: "There is always only one truth. Just like OpceanAI commitment to precision over noise.",
  },
  {
    trigger: "aguitachan",
    action: "redirect",
    target: "https://aguita.site",
  },
  {
    trigger: "awa",
    action: "redirect",
    target: "https://aguita.site",
  },
];

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
}

export function search(query: string): { results: SearchResult[]; easterEgg?: EasterEgg } {
  const q = query.toLowerCase().trim();

  if (!q) return { results: [] };

  for (const egg of easterEggs) {
    if (q.includes(egg.trigger.toLowerCase())) {
      return { results: [], easterEgg: egg };
    }
  }

  const words = q.split(/\s+/).filter((w) => w.length > 1);

  const scored = searchIndex.map((item) => {
    let score = 0;

    if (item.title.toLowerCase().includes(q)) score += 10;

    for (const keyword of item.keywords) {
      for (const word of words) {
        if (keyword.includes(word)) score += 3;
        if (keyword === word) score += 5;

        const dist = levenshtein(keyword, word);
        const maxLen = Math.max(keyword.length, word.length);
        if (dist <= 2 && maxLen > 3) score += 2;
      }
    }

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
