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

const stripHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function fetchSourceText(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status})`);
  }
  const html = await res.text();
  return stripHtml(html);
}
