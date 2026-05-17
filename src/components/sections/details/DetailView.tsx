"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { animate, stagger } from "animejs";
import {
  Brain, Calendar, GitBranch, Heart, Zap, ArrowRight,
  Container, Shield, Smartphone, Server, Cpu, Code, Terminal,
  Search, Target, Layers, AlertCircle,
  Minimize2, Languages, BarChart3, Database,
  FileCode, X, ExternalLink,
} from "lucide-react";

interface DetailContent {
  id: string;
  title: string;
  label: string;
  labelColor: string;
  subtitle: string;
  description: string;
  externalLinks?: { label: string; url: string }[];
  render: () => React.ReactNode;
}

const detailContents: DetailContent[] = [
  {
    id: "detail-yuuki",
    title: "YuuKi",
    label: "Flagship Model",
    labelColor: "text-accent",
    subtitle: "The central intellectual line of OpceanAI.",
    description: "It is not just a model name. It is a lineage. From v0.1 to NxG to RxG -- each version represents the continuing development of the original AI line.",
    externalLinks: [
      { label: "YuuKi v0.1", url: "https://yuuki-web.vercel.app/" },
      { label: "YuuKi RxG", url: "https://yuuki.opceanai.com/" },
    ],
    render: () => (
      <DetailYuuki />
    ),
  },
  {
    id: "detail-yumo",
    title: "Yumo",
    label: "Mathematics",
    labelColor: "text-accent",
    subtitle: "Specialized branch of the YuuKi ecosystem.",
    description: "Based on YuuKi, but specialized in mathematics. Demonstrates that OpceanAI creates targeted, domain-oriented models.",
    render: () => (
      <DetailYumo />
    ),
  },
  {
    id: "detail-doki",
    title: "Doki",
    label: "Current Product",
    labelColor: "text-accent",
    subtitle: "Bringing Docker containers to Android.",
    description: "Launched in May 2026. Doki is a system focused on bringing Docker containers to Android. It is compatible with OCI images and supports four layers of isolation depending on the environment.",
    externalLinks: [
      { label: "Doki Website", url: "https://doki.opceanai.com" },
    ],
    render: () => (
      <DetailDoki />
    ),
  },
  {
    id: "detail-asl",
    title: "ASL",
    label: "Future -- Planned",
    labelColor: "text-text-quaternary",
    subtitle: "Android Subsystem for Linux",
    description: "An alternative to Microsoft WSL. ASL is focused on implementing a complete Linux kernel running in userspace, so that Linux applications believe they are running on native Linux rather than Android.",
    render: () => (
      <DetailASL />
    ),
  },
  {
    id: "detail-nhe",
    title: "NHE",
    label: "Research",
    labelColor: "text-info",
    subtitle: "Not Humanity Exam",
    description: "Not how much the model knows. But how human it still thinks.",
    render: () => (
      <DetailNHE />
    ),
  },
  {
    id: "detail-tsuki",
    title: "Tsuki",
    label: "Token Compression",
    labelColor: "text-accent",
    subtitle: "A quiet contribution to the ecosystem.",
    description: "Tsuki is a token compression model. Its value is not loud branding. Its value is precision.",
    render: () => (
      <DetailTsuki />
    ),
  },
  {
    id: "detail-origin",
    title: "Origin",
    label: "April 23, 2023",
    labelColor: "text-accent",
    subtitle: "Where it all began.",
    description: "OpceanAI was born on April 23, 2023, originally under the name Ocean. At that stage, the mission was simple: build bots for Discord and Telegram.",
    render: () => (
      <DetailOrigin />
    ),
  },
];

function DetailYuuki() {
  const timeline = [
    { version: "v0.1", date: "2025", label: "First prototype", description: "The first prototype of the OpceanAI Lab era. Where it all began." },
    { version: "NxG", date: "2026", label: "Next generation", description: "The continuing development of the original AI line." },
    { version: "RxG", date: "2026", label: "Refined generation", description: "The current state of the YuuKi lineage." },
  ];

  return (
    <div className="space-y-16">
      <div className="glass-panel p-10 text-left detail-item">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0">
            <img src="/yuuki/yuuki.jpg" alt="YuuKi" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-display text-xl font-medium text-text-primary">The origin of the name YuuKi</h3>
            <p className="text-sm text-text-quaternary mt-1">The name YuuKi comes from a very specific personal and emotional context.</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
          <p>Around October 2025, after personal problems, awa entered a period of depression. During that time, <strong className="text-text-primary">Girls&apos; Last Tour</strong> became deeply meaningful. Its style, atmosphere, and emotional tone made a strong impact.</p>
          <p>After finishing the manga, awa felt unable to continue carrying that emotional state in the same way. A Discord bot called <strong className="text-text-primary">Yuki</strong> was created, but it did not become what was hoped for, and it was eventually discontinued.</p>
          <p>Even so, that emotional path remained important, because it became part of the name and identity of what would later become <strong className="text-accent font-medium">YuuKi</strong>.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">The Lineage</h3>
        <div className="space-y-6">
          {timeline.map((v, i) => (
            <div key={v.version} className="glass-panel p-8 text-left detail-item group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                  <img src="/yuuki/yuuki.jpg" alt={v.version} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-display text-xl font-medium text-text-primary group-hover:text-accent transition-colors">{v.version}</h4>
                    <span className="text-xs font-mono text-text-quaternary bg-surface-2 px-2 py-0.5 rounded">{v.date}</span>
                    <span className="text-xs text-text-tertiary">{v.label}</span>
                  </div>
                  <p className="text-sm text-text-tertiary leading-relaxed">{v.description}</p>
                </div>
              </div>
              {i < timeline.length - 1 && (
                <div className="flex justify-center mt-6">
                  <ArrowRight className="w-4 h-4 text-text-quaternary rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-10 text-center detail-item">
        <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
          &ldquo;This rename turned a technical milestone into an identity. Iris was the first milestone. YuuKi became the real symbol.&rdquo;
        </p>
      </div>
    </div>
  );
}

function DetailYumo() {
  return (
    <div className="space-y-16">
      <div className="glass-panel p-10 text-left detail-item">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0">
            <img src="/yuuki/yuuki.jpg" alt="Yumo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-display text-xl font-medium text-text-primary">Yumo</h3>
            <p className="text-sm text-text-quaternary mt-1">Mathematics-specialized models</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
          <p>The Yumo models emerged as a specialized branch of the YuuKi ecosystem. Based on YuuKi, but specialized in mathematics.</p>
          <p>Demonstrates that OpceanAI creates targeted, domain-oriented models — specialized, focused, mathematical, structured.</p>
        </div>
      </div>

      <div className="glass-panel p-10 text-center detail-item">
        <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
          &ldquo;Specialized, focused, mathematical, structured.&rdquo;
        </p>
      </div>
    </div>
  );
}

function DetailDoki() {
  const capabilities = [
    { icon: Container, title: "OCI Compatible", desc: "Full compatibility with OCI container images. Run standard Docker containers on Android without modification.", detail: "Doki accepts any OCI-compliant container image, meaning the vast ecosystem of Docker images works out of the box." },
    { icon: Shield, title: "4 Isolation Layers", desc: "Multiple security layers depending on the environment. Adaptable isolation from sandboxed to full system-level.", detail: "The isolation layers adapt to the environment -- from lightweight sandboxing for development to full system-level isolation for production workloads." },
    { icon: Smartphone, title: "Android Native", desc: "Bringing Docker containers directly to Android devices. No cloud dependency, no remote server.", detail: "Doki runs entirely on-device. No cloud dependency means your containers run locally, with full control and zero latency." },
  ];

  const significance = [
    { icon: Zap, label: "From AI to Infrastructure", desc: "Doki represents the move from model research toward platform infrastructure." },
    { icon: Server, label: "Running Systems", desc: "This is not only about AI anymore. It is about running systems." },
    { icon: Calendar, label: "Launched May 2026", desc: "The most recent project in the OpceanAI ecosystem." },
  ];

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">Capabilities</h3>
        {capabilities.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="glass-panel p-8 text-left detail-item group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-lg font-medium text-text-primary mb-2">{c.title}</h4>
                  <p className="text-sm text-text-tertiary leading-relaxed mb-3">{c.desc}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{c.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-8">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">Why Doki Matters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {significance.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-panel p-6 text-center detail-item">
                <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-text-tertiary" />
                </div>
                <h4 className="font-display text-sm font-medium text-text-primary mb-2">{s.label}</h4>
                <p className="text-xs text-text-tertiary leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-10 text-center detail-item">
        <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
          &ldquo;Doki is important because it represents the move from model research toward platform infrastructure. This is not only about AI anymore. It is about running systems.&rdquo;
        </p>
      </div>
    </div>
  );
}

function DetailASL() {
  const techStack = [
    { icon: Code, label: "C++", desc: "Core systems programming and performance-critical paths", detail: "C++ provides the raw performance needed for syscall translation and kernel-level operations in userspace." },
    { icon: Terminal, label: "Rust", desc: "Memory safety and systems-level correctness", detail: "Rust ensures that the most critical parts of ASL are memory-safe, preventing entire classes of bugs at compile time." },
    { icon: Cpu, label: "Modified proot", desc: "Syscall handling layer for Android compatibility", detail: "A modified proot layer intercepts and translates Linux syscalls so they work within Android&apos;s userspace constraints." },
  ];

  const designPrinciples = [
    { icon: Server, label: "Kernel-first", desc: "OpceanAI will not build a distribution. Only the kernel. The rest is intended for the community." },
    { icon: Shield, label: "Not distribution-first", desc: "The focus is purely on the kernel layer. Community distributions can be built on top." },
    { icon: GitBranch, label: "Community-driven", desc: "Once the kernel is complete, the ecosystem of distributions and tools is left to the community." },
  ];

  return (
    <div className="space-y-16">
      <div className="glass-panel p-10 text-left detail-item">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6 text-text-tertiary" />
          </div>
          <div>
            <h3 className="font-display text-xl font-medium text-text-primary">How it works</h3>
            <p className="text-sm text-text-quaternary mt-1">Invisible to Android, real to Linux</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
          <p>To the Android system, ASL appears as just another process consuming resources. It runs in userspace, managed by Android&apos;s process scheduler and resource manager.</p>
          <p className="text-text-primary font-medium">But internally, it is a real kernel.</p>
          <p>Linux applications running inside ASL believe they are on native Linux. They see a full Linux kernel, with proper syscalls, process management, and filesystem support. The modified proot layer handles the translation between Linux expectations and Android reality.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">Technical Direction</h3>
        {techStack.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="glass-panel p-8 text-left detail-item group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-6 h-6 text-text-tertiary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-lg font-medium text-text-primary mb-2">{t.label}</h4>
                  <p className="text-sm text-text-tertiary leading-relaxed mb-3">{t.desc}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{t.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-8">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">Design Principles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {designPrinciples.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="glass-panel p-6 text-center detail-item">
                <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-text-tertiary" />
                </div>
                <h4 className="font-display text-sm font-medium text-text-primary mb-2">{p.label}</h4>
                <p className="text-xs text-text-tertiary leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-10 text-center detail-item">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="badge badge-research">kernel-first</span>
          <span className="badge badge-research">not distribution-first</span>
          <span className="badge badge-warning">planned</span>
        </div>
        <p className="text-sm text-text-tertiary leading-relaxed mb-3">OpceanAI will not build a distribution. Only the kernel. The rest is intended for the community.</p>
        <p className="text-sm text-text-quaternary italic">ASL development begins once Doki v1 is complete.</p>
      </div>
    </div>
  );
}

function DetailNHE() {
  const existingBenchmarks = [
    { name: "HLE", focus: "Hard problems, but still knowledge-based" },
    { name: "MMLU", focus: "Massive multitask language understanding" },
    { name: "BIG-Bench", focus: "Broad evaluation of AI capabilities" },
    { name: "ARC", focus: "Abstraction and reasoning challenges" },
  ];

  const cognitivePatterns = [
    { icon: Brain, label: "Pattern 1", desc: "Structural patterns embedded within human language itself" },
    { icon: Layers, label: "Pattern 2", desc: "Cognitive structures that systems trained on human text cannot escape" },
    { icon: Target, label: "Pattern 3", desc: "Traces of human thought processes regardless of scale or capability" },
    { icon: Search, label: "Pattern 4", desc: "Linguistic fingerprints that reveal the source of training data" },
    { icon: Brain, label: "Pattern 5", desc: "Reasoning patterns that mirror human cognitive biases" },
    { icon: AlertCircle, label: "Pattern 6", desc: "Structural artifacts of human knowledge representation" },
  ];

  return (
    <div className="space-y-16">
      <div className="space-y-8">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">The Problem with Existing Benchmarks</h3>
        <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto text-center detail-item">Every existing benchmark measures nearly the same dimension:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {existingBenchmarks.map((b) => (
            <div key={b.name} className="glass-panel p-6 text-left detail-item">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center">
                  <Search className="w-4 h-4 text-text-quaternary" />
                </div>
                <h4 className="font-display text-sm font-medium text-text-tertiary">{b.name}</h4>
              </div>
              <p className="text-xs text-text-quaternary">{b.focus}</p>
            </div>
          ))}
        </div>
        <div className="glass-panel p-8 text-center detail-item">
          <p className="text-sm text-text-secondary leading-relaxed">They all measure: <strong className="text-text-primary">what a model knows</strong>, <strong className="text-text-primary"> how much human knowledge it can reproduce</strong>, and <strong className="text-text-primary">how accurately it can reason</strong>.</p>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">What NHE Measures</h3>
        <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto text-center detail-item">NHE measures the presence of six cognitive patterns structurally embedded within human language itself. These are patterns that systems trained on human text cannot fully escape regardless of scale, capability, or intelligence level.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cognitivePatterns.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="glass-panel p-6 text-left detail-item">
                <div className="w-10 h-10 rounded-xl bg-info-soft flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-info" />
                </div>
                <h4 className="font-display text-sm font-medium text-text-primary mb-2">{p.label}</h4>
                <p className="text-xs text-text-tertiary leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-10 text-left detail-item">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0">
            <img src="/imprint/nhe.webp" alt="Imprint" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-display text-xl font-medium text-text-primary">The Imprint Theory</h3>
            <p className="text-sm text-text-quaternary mt-1">NHE as empirical implementation</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
          <p>NHE serves as an empirical implementation of The Imprint Theory.</p>
          <p>Rather than measuring accumulated knowledge, NHE attempts to measure traces of human cognitive structure remaining inside artificial systems.</p>
          <p className="text-text-primary font-medium">The question is not about intelligence. It is about the imprint -- the structural residue of human thought that persists inside AI, regardless of how capable that AI becomes.</p>
        </div>
      </div>

      <div className="glass-panel p-10 text-center detail-item">
        <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
          &ldquo;NHE asks a fundamentally different question: Not how much the model knows. But how human it still thinks.&rdquo;
        </p>
      </div>
    </div>
  );
}

function DetailTsuki() {
  const trainingData = [
    { icon: Languages, label: "Bilingual", value: "Spanish + English", desc: "Two languages, one model" },
    { icon: Database, label: "Examples", value: "4,160", desc: "Carefully curated training pairs" },
    { icon: Target, label: "Task Types", value: "6", desc: "Different compression scenarios" },
    { icon: BarChart3, label: "Token Reduction", value: "57.6%", desc: "Average compression achieved" },
  ];

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {trainingData.map((d) => {
          const Icon = d.icon;
          return (
            <div key={d.label} className="glass-panel p-6 text-center detail-item">
              <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <p className="font-display text-2xl font-medium text-accent mb-1">{d.value}</p>
              <p className="text-xs font-medium text-text-primary mb-1">{d.label}</p>
              <p className="text-xs text-text-quaternary">{d.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-panel p-10 text-left detail-item">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center shrink-0">
            <Minimize2 className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-display text-xl font-medium text-text-primary">Training Details</h3>
            <p className="text-sm text-text-quaternary mt-1">Precision over noise</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-text-tertiary leading-relaxed">
          <p>Tsuki was trained on <strong className="text-text-primary">4,160 bilingual examples</strong> across <strong className="text-text-primary"> six different task types</strong>.</p>
          <p>The training data covered both <strong className="text-text-primary">Spanish and English</strong>, making Tsuki a truly bilingual compression model.</p>
          <p>The result was an average <strong className="text-accent font-medium">57.6% token reduction</strong> -- meaning that for every 100 tokens of input, Tsuki could compress them down to approximately 42 tokens while preserving the essential information.</p>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">The Philosophy Behind Tsuki</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-panel p-8 text-left detail-item">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center">
                <Zap className="w-5 h-5 text-text-tertiary" />
              </div>
              <h4 className="font-display text-sm font-medium text-text-primary">Quality over Noise</h4>
            </div>
            <p className="text-sm text-text-tertiary leading-relaxed">Tsuki reflects the philosophy of OpceanAI: quality over noise, even without recognition. It does not need to be loud. It just needs to work.</p>
          </div>
          <div className="glass-panel p-8 text-left detail-item">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center">
                <Target className="w-5 h-5 text-text-tertiary" />
              </div>
              <h4 className="font-display text-sm font-medium text-text-primary">Precision</h4>
            </div>
            <p className="text-sm text-text-tertiary leading-relaxed">Its value is not in branding or marketing. Its value is in precision -- doing one thing extremely well, quietly, without fanfare.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 text-center detail-item">
        <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
          &ldquo;Quality over noise, even without recognition.&rdquo;
        </p>
      </div>
    </div>
  );
}

function DetailOrigin() {
  const dna = [
    { icon: Zap, label: "Build first", desc: "Start building before you have all the answers" },
    { icon: Code, label: "Learn while building", desc: "Knowledge comes from doing, not planning" },
    { icon: Terminal, label: "Accept complexity", desc: "When needed, embrace the hard parts" },
    { icon: FileCode, label: "Use what is available", desc: "No perfect tools -- just what works" },
    { icon: Heart, label: "Keep moving forward", desc: "Persistence over perfection" },
  ];

  return (
    <div className="space-y-16">
      <div className="space-y-8">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">The First Creations</h3>

        {/* Sakura */}
        <div className="glass-panel p-10 text-left detail-item group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
              <img src="/sakura/sakura.jpg" alt="Sakura" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-display text-2xl font-medium text-text-primary">Sakura</h4>
              <p className="text-sm text-text-quaternary mt-1">Bots New Era</p>
            </div>
          </div>
          <p className="text-sm text-text-tertiary leading-relaxed mb-6">A massive monolithic beginning. Written as a single main.py file with around 11,000 lines of code. A direct, bold, experimental approach that defined the early spirit of OpceanAI.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Language", value: "Python" },
              { label: "Structure", value: "Single main.py" },
              { label: "Size", value: "~11k lines" },
              { label: "Type", value: "Monolithic" },
            ].map((d) => (
              <div key={d.label} className="bg-surface-2 rounded-lg p-3 text-center">
                <p className="text-xs text-text-quaternary mb-1">{d.label}</p>
                <p className="text-sm font-medium text-text-primary">{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nebula */}
        <div className="glass-panel p-10 text-left detail-item group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-110">
              <img src="/nebula/nebula-anime.jpg" alt="Nebula" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-display text-2xl font-medium text-text-primary">Nebula</h4>
              <p className="text-sm text-text-quaternary mt-1">Bots New Era</p>
            </div>
          </div>
          <p className="text-sm text-text-tertiary leading-relaxed mb-6">Built with JS/TS, representing a different implementation style. A contrasting path to Sakura, but part of the same foundational era that established the DNA of the organization.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Language", value: "JavaScript / TypeScript" },
              { label: "Structure", value: "Modular" },
              { label: "Style", value: "Different approach" },
              { label: "Era", value: "Foundational" },
            ].map((d) => (
              <div key={d.label} className="bg-surface-2 rounded-lg p-3 text-center">
                <p className="text-xs text-text-quaternary mb-1">{d.label}</p>
                <p className="text-sm font-medium text-text-primary">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="font-display text-2xl font-medium text-text-primary text-center detail-item">The DNA of This Era</h3>
        <p className="text-text-tertiary text-base leading-relaxed max-w-lg mx-auto text-center detail-item">This phase matters because it established the DNA of the organization.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dna.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.label} className="glass-panel p-6 text-left detail-item">
                <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-display text-sm font-medium text-text-primary mb-2">{d.label}</h4>
                <p className="text-xs text-text-tertiary leading-relaxed">{d.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-10 text-center detail-item">
        <p className="font-display text-xl text-text-primary italic leading-relaxed max-w-lg mx-auto">
          &ldquo;Sakura and Nebula were not just the first projects. They were the first signs of a system becoming an organization.&rdquo;
        </p>
      </div>
    </div>
  );
}

export default function DetailView() {
  const [activeDetail, setActiveDetail] = useState<DetailContent | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const detail = detailContents.find((d) => d.id === hash);
      if (detail) {
        setActiveDetail(detail);
        setVisible(true);
        setTimeout(() => {
          if (itemsRef.current) {
            const items = itemsRef.current.querySelectorAll(".detail-item");
            animate(items, {
              opacity: [0, 1], translateY: ["20px", "0px"],
              duration: 600, delay: stagger(80, { from: "first" }), ease: "out(3)",
              autoplay: true,
            });
          }
        }, 100);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setActiveDetail(null);
      window.history.pushState(null, "", window.location.pathname);
    }, 300);
  }, []);

  if (!activeDetail) return null;

  return (
    <section
      id={activeDetail.id}
      ref={sectionRef}
      className={`relative py-32 px-4 min-h-screen transition-all duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-4xl mx-auto">
        <div ref={itemsRef}>
          {/* Close button */}
          <div className="flex items-center justify-between mb-12 detail-item">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
            {activeDetail.externalLinks && (
              <div className="flex items-center gap-2">
                {activeDetail.externalLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <span className={`inline-block text-xs font-mono uppercase tracking-widest ${activeDetail.labelColor} detail-item`}>{activeDetail.label}</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text-primary tracking-tight leading-tight detail-item">{activeDetail.title}</h2>
            <p className="text-text-primary text-xl font-medium max-w-lg mx-auto detail-item">{activeDetail.subtitle}</p>
            <p className="text-text-tertiary text-base leading-relaxed max-w-xl mx-auto detail-item">{activeDetail.description}</p>
          </div>

          {/* Content */}
          {activeDetail.render()}
        </div>
      </div>
    </section>
  );
}
