export const CHRIST_SOURCES = [
  "https://christuniversity.in/admission-home",
  "https://christuniversity.in/admission/2026-ugpgsp",
  "https://christuniversity.in/examination",
  "https://christuniversity.in/hostel/main-campus/hostel-and-dining",
  "https://christuniversity.in/student-life/main-campus/campus-life",
  "https://christuniversity.in/International-Students",
  "https://christuniversity.in/academics",
  "https://christuniversity.in/campuses",
];

export type RankedSourceChunk = {
  url: string;
  label: string;
  chunk: string;
  score: number;
};

type SourceCacheEntry = {
  text: string;
  expiresAt: number;
};

const DEFAULT_SOURCE_CACHE_TTL_MS = 15 * 60 * 1000;
const parseTtlMs = (value: string | undefined) => {
  if (!value) return DEFAULT_SOURCE_CACHE_TTL_MS;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_SOURCE_CACHE_TTL_MS;
  return Math.floor(parsed);
};

const SOURCE_CACHE_TTL_MS = parseTtlMs(process.env.SOURCE_CACHE_TTL_MS);
const sourceTextCache = new Map<string, SourceCacheEntry>();
const inflightSourceRequests = new Map<string, Promise<string>>();

export function getSourceCacheDiagnostics() {
  return {
    ttlMs: SOURCE_CACHE_TTL_MS,
    cachedEntries: sourceTextCache.size,
    inflightRequests: inflightSourceRequests.size,
  };
}

const decodeHtmlEntities = (text: string) =>
  text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, num) => {
      const code = Number(num);
      return Number.isFinite(code) ? String.fromCharCode(code) : " ";
    });

const buildSourceLabel = (url: string) => {
  try {
    const { hostname, pathname } = new URL(url);
    const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
    return cleanPath ? `${hostname}/${cleanPath}` : hostname;
  } catch {
    return url;
  }
};

const cleanHtml = (html: string) =>
  html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<form[\s\S]*?<\/form>/gi, " ")
    .replace(/<button[\s\S]*?<\/button>/gi, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<(h[1-6]|p|li|td|th|br|section|article|div)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

const NOISY_PATTERNS: RegExp[] = [
  /privacy policy/i,
  /copyright/i,
  /website developed by/i,
  /social media/i,
  /facebook|instagram|linkedin|youtube|flickr|twitter/i,
  /vision\s+excellence and service/i,
  /mission\s+christ/i,
  /campus\s+academics\s+admission\s+examination/i,
  /^image$/i,
  /^sidebar$/i,
  /^additional links$/i,
];

const stripNoiseLines = (text: string) =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 20)
    .filter((line) => !NOISY_PATTERNS.some((pattern) => pattern.test(line)))
    .join("\n");

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const splitIntoChunks = (text: string, maxLength = 900) => {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if ((`${current}\n${paragraph}`).trim().length > maxLength && current.trim()) {
      chunks.push(current.trim());
      current = paragraph;
    } else {
      current = `${current}\n${paragraph}`.trim();
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
};

const scoreChunk = (query: string, chunk: string) => {
  const q = normalizeText(query);
  const c = normalizeText(chunk);
  if (!q || !c) return 0;

  const terms = q.split(" ").filter((term) => term.length > 2);
  if (!terms.length) return 0;

  const uniqueTerms = Array.from(new Set(terms));
  const tokenMatches = uniqueTerms.reduce((sum, term) => {
    if (!c.includes(term)) return sum;
    return sum + 1;
  }, 0);

  let phraseBonus = 0;
  if (q.length >= 12 && c.includes(q)) phraseBonus += 2;
  if (uniqueTerms.length >= 3) {
    const pair = `${uniqueTerms[0]} ${uniqueTerms[1]}`;
    if (c.includes(pair)) phraseBonus += 1;
  }

  return tokenMatches + phraseBonus;
};

const stripHtml = (html: string) => {
  const cleaned = cleanHtml(html);
  const decoded = decodeHtmlEntities(cleaned);
  const compact = decoded.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
  return stripNoiseLines(compact);
};

export async function fetchSourceText(url: string) {
  const now = Date.now();
  const cached = sourceTextCache.get(url);
  if (cached && cached.expiresAt > now) {
    return cached.text;
  }

  const inflight = inflightSourceRequests.get(url);
  if (inflight) return inflight;

  const request = (async () => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url} (${res.status})`);
    }

    const html = await res.text();
    const text = stripHtml(html);

    sourceTextCache.set(url, {
      text,
      expiresAt: Date.now() + SOURCE_CACHE_TTL_MS,
    });

    return text;
  })();

  inflightSourceRequests.set(url, request);

  try {
    return await request;
  } finally {
    inflightSourceRequests.delete(url);
  }
}

export async function getRankedSourceChunks(
  query: string,
  maxTotalChunks = 8
): Promise<RankedSourceChunk[]> {
  const settled = await Promise.allSettled(
    CHRIST_SOURCES.map(async (url) => ({
      url,
      text: await fetchSourceText(url),
    }))
  );

  const ranked = settled
    .flatMap((result) => {
      if (result.status !== "fulfilled") return [];

      const { url, text } = result.value;
      const chunks = splitIntoChunks(text);

      return chunks
        .map((chunk) => ({
          url,
          label: buildSourceLabel(url),
          chunk,
          score: scoreChunk(query, chunk),
        }))
        .filter((item) => item.score > 0);
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxTotalChunks);

  return ranked;
}
