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
  updatedAt?: string;
  image?: string;
  imageAlt?: string;
  preview: readonly string[];
  /** Optional context shown under the preview on publication cards. */
  previewNote?: string;
};

export const publications: readonly Publication[] = [
  {
    slug: "the-one-idea",
    title: "The One Idea",
    description:
      "Every AI you used today runs on one idea from 2017. A plain-language essay, film and interactive explorer on the Transformer, and on what it quietly traded away.",
    status: "published",
    type: "interactive-essay",
    author: "Remco Vroom",
    source: null,
    date: "2026-09-27",
    preview: [
      "Every AI you used today runs on one idea from 2017.",
      "Not a company. Not a product. A design decision in a paper about translation: stop reading one word at a time, and let every word look at every other word, all at once.",
    ],
    previewNote: "Episode one of Uncovering How AI Works. Includes a 30-second film and an illustrative attention explorer.",
  },
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
    previewNote: "Author’s historical illustration. The full essay includes assumptions and source context.",
  },
  {
    slug: "qip-thesis",
    title: "The Quantum Intelligence Protocol",
    description:
      "The full Quantum Intelligence Protocol thesis: seven principles for agent governance, persistent memory and learning across autonomous systems.",
    status: "research",
    type: "research-thesis",
    date: "2026-04-07",
    updatedAt: "2026-09-27",
    image: "/assets/publication-qip.webp",
    imageAlt: "A continuous amber seam through layered stone, the QIP thesis artwork.",
    author: "Remco Vroom",
    source: {
      title: "Original thesis on Substack",
      url: "https://rem8ntic.substack.com/p/quantum-intelligence-protocol",
    },
    preview: [
      "What if each interaction could leave the next one better informed?",
      "Read the complete thesis: eleven chapters on governing autonomous agents, three-tier memory and intelligence that carries forward, with interactive illustrations of the proposed architecture.",
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

export const qipThesisMedia = {
  film: "/assets/publications/qip-thesis/film.mp4",
  poster: "/assets/publications/qip-thesis/film-poster.webp",
  transcript: [
    "Why start from scratch every day? Imagine your AI remembering useful lessons so you spend less energy repeating and more time creating.",
    "Quantum Intelligence Protocol gives AI agents a shared memory so they can use past lessons and work together with you in charge.",
    "A shared notebook keeps important decisions available, helping your next project benefit from the valuable experience you have already gained.",
    "Your agents compare perspectives and challenge assumptions, helping you explore alternative possibilities before bringing the strongest ideas together.",
    "The real opportunity is continuous improvement as agents complete a task, capture a useful reviewed lesson, and bring that experience into tomorrow.",
    "Now in beta, QIP explores how shared learning could mean fewer mistakes and better teamwork. 8NTIC, uncovering how AI works.",
  ],
} as const;

export const tokenGapMedia = {
  film: "/assets/publications/the-token-gap/film-clean-titles.mp4",
  poster: "/assets/publications/the-token-gap/film-poster.webp",
  transcript: [
    "A thousand tokens. Play this illustration: the fastest AI takes two seconds while your speaking lane crawls.",
    "Human speech takes two hundred and fifty seconds, an enormous gap. Pause, restart and open the numbers behind it.",
    "The real prize is tokens per insight: explore The Token Gap with AGENTIC. Uncovering how AI works.",
  ],
} as const;

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

/* ---------- The One Idea (Uncovering How AI Works, episode one) ---------- */

export const oneIdeaMedia = {
  film: "/assets/publications/the-one-idea/film.mp4",
  captions: "/assets/publications/the-one-idea/film.vtt",
  poster: "/assets/publications/the-one-idea/film-poster.webp",
} as const;

export type OneIdeaFigure = { src: string; alt: string; caption: string };

export type OneIdeaSection = {
  id: string;
  title: string | null;
  paragraphs: readonly string[];
  pullLine?: string;
  figure?: OneIdeaFigure;
};

export const oneIdeaSections: readonly OneIdeaSection[] = [
  {
    id: "one-idea",
    title: null,
    paragraphs: [
      "Every AI you used today runs on one idea from 2017.",
      "Not a company. Not a product. Not a breakthrough in chips. A design decision inside a paper about translating English into German: stop reading one word at a time, and let every word look at every other word, all at once.",
      "The paper was called Attention Is All You Need. The architecture it introduced was called the Transformer. The T in ChatGPT stands for it. So does almost everything else you now call AI.",
      "This is the first episode of Uncovering How AI Works: the ideas underneath the tools, explained without the jargon, so you can judge what comes next instead of just reacting to it.",
    ],
  },
  {
    id: "the-paper",
    title: "Eight people, one paper, a Beatles joke",
    paragraphs: [
      "In June 2017, eight researchers working at Google posted a paper to arXiv. The title borrowed from the Beatles. The author list came with a footnote that has aged into a small legend: equal contribution, listing order is random.",
      "Their ambition was modest by today’s standards. Translate better. Train faster. On the standard English-to-German benchmark they beat every previous result, ensembles included, and their largest model trained in three and a half days on eight graphics cards.",
      "Nobody in that group was trying to build a chatbot. That is the first lesson worth keeping. The ideas that change everything rarely announce themselves. They show up as a better way to do something boring.",
    ],
    figure: {
      src: "/assets/publications/the-one-idea/one-paper.webp",
      alt: "An open book of cream pages on a dark stone surface, lit by a warm amber light.",
      caption: "One paper. The idea inside it now runs underneath almost every AI product you touch.",
    },
  },
  {
    id: "word-by-word",
    title: "Before: reading through a keyhole",
    paragraphs: [
      "Before 2017, language models read the way you would read through a keyhole. One word, then the next, then the next. These were recurrent neural networks, and the idea was elegant: carry a running memory forward, update it with each word, and hope the important parts survive the trip.",
      "Often they did not. By the end of a long sentence, the beginning had faded. Ask one of these models what “it” referred to twenty words back and it was guessing from a blurred summary.",
      "Worse, it was slow in a way no budget could fix. Word nine had to wait for word eight. Word eight had to wait for word seven. You could buy a thousand processors and most of them would sit idle, waiting in line.",
    ],
    pullLine: "The problem was never intelligence. It was the queue.",
    figure: {
      src: "/assets/publications/the-one-idea/word-by-word.webp",
      alt: "The stone explorer NTIC stands on a single glowing tile in a long line of dark stone tiles that stretches into the darkness.",
      caption: "Before the Transformer: one tile at a time, and the light behind you fades.",
    },
  },
  {
    id: "attention",
    title: "The one idea: everyone listens to everyone",
    paragraphs: [
      "The Transformer threw the queue away. Instead of passing a memory from word to word, it lets every word look directly at every other word in the sentence, at the same moment, and decide how much each one matters to it.",
      "Take the sentence: the animal didn’t cross the street because it was too tired. You know instantly that “it” is the animal. Change one word, too wide, and “it” becomes the street. Nothing about the word “it” changed. What changed is what it pays attention to.",
      "Mechanically, each word asks a question, every other word holds up a label saying what it is about, and the strongest matches pass their meaning along. Engineers call these queries, keys and values. You can think of a room where everyone listens to everyone, and turns towards whoever is most relevant.",
      "Two refinements made it work. The model runs several of these listening passes side by side, eight in the original design, so one can follow grammar while another follows who is who. And because everything now happens at once, each word carries a small stamp of its position, so the model still knows that “dog bites man” is not “man bites dog”.",
    ],
    figure: {
      src: "/assets/publications/the-one-idea/attention.webp",
      alt: "A row of cream stone tiles in a dark tray. One raised tile glows amber and sends arcs of light of different strengths to every other tile while NTIC watches.",
      caption: "Attention: every word reaches every other word, and some connections carry more weight than others.",
    },
  },
  {
    id: "parallel",
    title: "The real breakthrough was not attention",
    paragraphs: [
      "Here is the flip. The title says attention is all you need. The history says something else. Attention already existed before 2017, bolted onto the old word-by-word models. What the Transformer really did was remove the waiting.",
      "When every word is processed at the same time, the work stops looking like a queue and starts looking like a spreadsheet: large grids of numbers multiplied together. That is exactly what graphics chips were built to do. Suddenly, more hardware meant more model.",
      "That is the unlock the last eight years were built on. Not a smarter algorithm. A shape of computation that finally fitted the machines. Scale did the rest.",
    ],
    pullLine: "Attention made the Transformer accurate. Parallelism made it inevitable.",
    figure: {
      src: "/assets/publications/the-one-idea/parallel.webp",
      alt: "A vast dark hall filled to the horizon with rows of stone tile trays, all glowing amber at the same moment, with a tiny NTIC in the foreground.",
      caption: "Parallel by design: every tray lights up at once, which is exactly the kind of work modern chips are built for.",
    },
  },
  {
    id: "everyday",
    title: "From translation to your pocket",
    paragraphs: [
      "A year later, OpenAI trained a stack of Transformer layers on a large pile of books and called the result a Generative Pre-trained Transformer. GPT. Google went the other way with BERT, a Transformer that reads in both directions at once, and within two years it was helping Search understand what people actually meant.",
      "Then the idea escaped language. The same architecture now sits underneath the assistant you asked something this morning, the translation in your browser, the code suggestions in an engineer’s editor, and many of today’s image and video generators.",
      "So when the AI in your pocket follows a conversation, summarises a contract or rewrites an email in your tone, the honest explanation is not magic. It is an enormous number of words, each paying attention to all the others.",
    ],
    figure: {
      src: "/assets/publications/the-one-idea/everyday.webp",
      alt: "NTIC sits beside a smartphone on a dark stone surface as soft amber arcs of light rise from the glowing screen.",
      caption: "From a translation benchmark to the phone in your hand in fewer than ten years.",
    },
  },
  {
    id: "trade-off",
    title: "What the paper quietly traded away",
    paragraphs: [
      "Every winning design gives something up. The Transformer’s price hides in plain sight: if every word looks at every other word, the work grows with the square of the length. Double the text, and the attention work quadruples.",
      "That one trade-off explains a lot of the AI you already feel. Why context windows have limits. Why long documents cost more. Why a large part of current research, from sparse attention to state-space models, is trying to keep the magic while escaping the square.",
      "The authors know this better than anyone. All eight eventually left Google to build companies and labs of their own. Reunited on stage in 2024, Aidan Gomez said the field needs successors that can carry it to a new plateau of performance. The people who built the idea are among the most eager to replace it.",
    ],
  },
];

export const oneIdeaClosing = [
  "So the lesson of 2017 is not attention. It is this: the biggest breakthroughs rarely add intelligence. They remove a constraint.",
  "One paper removed the queue. The question worth staying with is which queue we are all still standing in.",
] as const;

/** Illustrative attention weights for the explorer. Hand-set, not taken from a trained model. */
export type AttentionEnding = "tired" | "wide";

export const attentionTokens = (ending: AttentionEnding) =>
  ["The", "animal", "didn’t", "cross", "the", "street", "because", "it", "was", "too", ending] as const;

export function attentionWeights(ending: AttentionEnding, focus: number): number[] {
  const n = 11;
  const raw = new Array<number>(n).fill(0.04);
  const referent = ending === "tired" ? 1 : 5;
  const other = ending === "tired" ? 5 : 1;
  if (focus === 7 || focus === 10) {
    raw[referent] = focus === 7 ? 0.62 : 0.5;
    raw[other] = 0.06;
    raw[7] = focus === 7 ? 0.1 : 0.16;
    raw[10] = focus === 7 ? 0.12 : 0.14;
    raw[8] = 0.06;
  } else if (focus === 1 || focus === 5) {
    raw[focus] = 0.3;
    raw[focus - 1] = 0.22;
    raw[3] = 0.16;
    if (focus === referent) raw[7] = 0.2;
  } else {
    raw[focus] = 0.34;
    if (focus > 0) raw[focus - 1] = 0.2;
    if (focus < n - 1) raw[focus + 1] = 0.16;
  }
  const total = raw.reduce((sum, value) => sum + value, 0);
  return raw.map((value) => value / total);
}

export const oneIdeaSources = [
  {
    title: "Vaswani et al., Attention Is All You Need (arXiv, 2017)",
    url: "https://arxiv.org/abs/1706.03762",
    description: "The original paper. The abstract reports 28.4 BLEU on WMT 2014 English-to-German and training of the large model in 3.5 days on eight GPUs.",
  },
  {
    title: "Google Research: Transformer, a novel neural network architecture for language understanding",
    url: "https://research.google/blog/transformer-a-novel-neural-network-architecture-for-language-understanding/",
    description: "Jakob Uszkoreit’s August 2017 announcement, including the animal and street example used in the attention explorer.",
  },
  {
    title: "Bahdanau, Cho and Bengio, Neural Machine Translation by Jointly Learning to Align and Translate (2014)",
    url: "https://arxiv.org/abs/1409.0473",
    description: "Attention before the Transformer, added to recurrent translation models.",
  },
  {
    title: "OpenAI: Improving language understanding with unsupervised learning (2018)",
    url: "https://openai.com/index/language-unsupervised/",
    description: "The first GPT: a Transformer pre-trained on books, then fine-tuned for tasks.",
  },
  {
    title: "Devlin et al., BERT (2018) and Google Search (2019)",
    url: "https://blog.google/products/search/search-language-understanding-bert/",
    description: "How a bidirectional Transformer started helping Search understand queries. The BERT paper is arXiv 1810.04805.",
  },
  {
    title: "Wikipedia: Attention Is All You Need",
    url: "https://en.wikipedia.org/wiki/Attention_Is_All_You_Need",
    description: "Background on the title, the randomised author order and where the eight authors went next.",
  },
  {
    title: "NVIDIA: ‘You Transformed the World’, GTC 2024 panel",
    url: "https://blogs.nvidia.com/blog/gtc-2024-transformer-ai-research-panel-jensen",
    description: "The 2024 reunion of the authors, including Aidan Gomez on the need for successors to the Transformer.",
  },
] as const;
