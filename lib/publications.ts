export type Publication = {
  slug: string;
  title: string;
  description: string;
  status: "published" | "research";
  type: "interactive-essay" | "research-thesis";
  author: string;
  source: { title: string; url: string } | null;
  /** An actual publication date, never a retrieval or implementation date. */
  date?: string;
  preview: readonly string[];
};

export const publications: readonly Publication[] = [
  {
    slug: "the-token-gap",
    title: "The Token Gap",
    description:
      "When machines produce language faster than people can read it, what becomes valuable? An interactive essay on speed, reasoning and human judgment.",
    status: "published",
    type: "interactive-essay",
    author: "Remco Vroom",
    source: null,
    preview: [
      "You are reading this at roughly four tokens per second.",
      "Most people have never done this arithmetic. They feel the speed as convenience. It is not convenience. It is a different physics of thought.",
    ],
  },
  {
    slug: "qip-thesis",
    title: "The Quantum Intelligence Protocol",
    description:
      "Explore the thinking behind QIP: shared context, agent coordination and learning that carries forward. An introduction with a link to the original thesis.",
    status: "research",
    type: "research-thesis",
    author: "Remco Vroom",
    source: {
      title: "Original thesis on Substack",
      url: "https://rem8ntic.substack.com/p/quantum-intelligence-protocol",
    },
    preview: [
      "What if each interaction could leave the next one better informed?",
      "QIP explores how people and agents can work with shared context, clear boundaries and lessons that carry forward. Read the introduction here, then continue to Remco’s original thesis.",
    ],
  },
];

export function getPublicationBySlug(slug: string): Publication | undefined {
  return publications.find((publication) => publication.slug === slug);
}

export function publicationTypeLabel(publication: Publication): string {
  return publication.type === "interactive-essay"
    ? "Interactive essay"
    : "Research thesis";
}

/** Historical assumptions preserved from the author's supplied manuscript. */
export const tokenRaceRunners = [
  { id: "gemini", name: "Gemini 3.5 Flash", rate: 497, kind: "machine" },
  { id: "groq", name: "Groq on Llama", rate: 315, kind: "machine" },
  { id: "claude", name: "Claude Fable 5.1", rate: 67, kind: "machine" },
  { id: "gpt", name: "GPT-6 Astra", rate: 60, kind: "machine" },
  { id: "thinking", name: "You, thinking", rate: 10, kind: "human" },
  { id: "speaking", name: "You, speaking", rate: 4, kind: "human" },
] as const;

export const tokenRaceTarget = 1_000;
export const tokenRaceDuration = 22;

export function tokenRaceProgress(rate: number, seconds: number) {
  const safeSeconds = Math.max(0, Math.min(tokenRaceDuration, seconds));
  const tokens = Math.min(tokenRaceTarget, safeSeconds * rate);
  return {
    tokens,
    percent: (tokens / tokenRaceTarget) * 100,
    finished: tokens >= tokenRaceTarget,
    finishSeconds: tokenRaceTarget / rate,
  };
}

export const tokenGapSections = [
  {
    id: "the-speed",
    title: null,
    paragraphs: [
      "You are reading this at roughly four tokens per second.",
      "That is not a metaphor. Human speech runs about 150 words a minute, which converts to three or four tokens per second in the same units we use to measure machines. Think silently and you speed up, maybe to ten. That is your ceiling. It was your grandmother's ceiling. It was the ceiling of the first person who ever explained something to another person.",
      "Claude Fable 5.1 runs at 67 tokens per second. GPT-6 Astra at 60. Gemini 3.5 Flash pushes close to 500. Groq's silicon holds 300-plus with a first token back in under 200 milliseconds.",
      "So the frontier models think out loud between fifteen and twenty times faster than you talk. The fast ones, over a hundred times faster.",
      "Most people have never done this arithmetic. They feel the speed as convenience. It is not convenience. It is a different physics of thought.",
    ],
  },
  {
    id: "tokens-per-insight",
    title: "The number that should worry you is not the speed",
    paragraphs: [
      "At maximum effort, Astra solves a task using around 27,000 output tokens. Fable 5.1 reaches the same score using 78,000. Same destination. Three times the thinking.",
      "Read that again, because it inverts the whole conversation. The models are not competing on speed. They are converging on speed, all of them sitting between 52 and 75 tokens per second at the top end. What separates them is how much reasoning they burn to arrive.",
      "Which means the real currency is not tokens per second. It is tokens per insight.",
      "And that is the one race where humans are still, for now, absurdly good. You do not need 78,000 tokens to decide whether to hire someone, enter a new market, or back a partner. You need a walk around the block and a hard conversation. Compression, not throughput.",
      "The flip: everyone is anxious about being outrun, because speed is the only dimension you can actually feel. You watch the tokens arrive. You cannot watch the reasoning that produced them. The competition was never the speed. It was the efficiency.",
    ],
  },
  {
    id: "compounding-curves",
    title: "Except the efficiency is moving too",
    paragraphs: [
      "Human reasoning speed has been flat for a hundred thousand years. No version bump. No effort setting. The wetware you run on today shipped in the Pleistocene and has had no meaningful throughput upgrade since.",
      "The machines are on two compounding curves at once.",
      "Moore's Law gave us transistor density doubling roughly every two years. Steady, predictable, the curve that built the modern economy. Huang's Law, coined at Nvidia's 2018 developer conference, is the claim that GPU performance for AI workloads is climbing considerably faster than that, because the gains stack: silicon, architecture, software, precision, decoding strategy, all improving together.",
      "Put those two lines on the same chart and Moore's looks almost conservative. Now add a third line for human cognition and you cannot draw it. It is flat. It has always been flat. It is the x-axis.",
    ],
  },
] as const;

export const tokenGapClosing =
  "And the efficiency gap is closing from the other direction. Astra needing a third of Fable's tokens for the same answer is not a hardware story. That is the models getting better at compressing thought. The thing we told ourselves was our edge.";

export const tokenGapSources = [
  {
    title: "Artificial Analysis model leaderboard",
    url: "https://artificialanalysis.ai/leaderboards/models",
    description: "The author's attribution for model throughput and token-efficiency comparisons. The live leaderboard changes; the draft's exact historical figures have not been independently reproduced here.",
  },
  {
    title: "Groq model documentation",
    url: "https://console.groq.com/docs/models",
    description: "Provider reference for model throughput. The draft does not identify the Llama variant or test configuration behind its 315 tokens-per-second assumption.",
  },
  {
    title: "Google: Gemini 3.5",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/",
    description: "Provider context for Gemini 3.5 Flash. The race retains the author's 497 tokens-per-second input; this link is not a reproduction of that measurement.",
  },
  {
    title: "NVIDIA: Bill Dally, Hot Chips 2023",
    url: "https://www.nvidia.com/en-us/on-demand/session/hotchips2023-keynote/",
    description: "The NVIDIA hardware-performance claim cited by the author, alongside the draft's reference to GTC 2018.",
  },
  {
    title: "Epoch AI: Trends in GPU price-performance",
    url: "https://epoch.ai/publications/trends-in-gpu-price-performance",
    description: "Marius Hobbhahn and Tamay Besiroglu's 2022 research offers the contrasting price-performance estimate cited in the draft. Hardware performance and performance per dollar are different measures.",
  },
] as const;
