export type MockFaq = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
};

export const MOCK_FAQS: MockFaq[] = [
  {
    id: "admissions-deadline",
    question: "What is the application deadline?",
    answer:
      "Sample data: Applications are reviewed in rolling cycles. Check the admissions page for the current intake dates and submit before the published cut‑off.",
    tags: ["admissions", "deadline", "application"],
  },
  {
    id: "admissions-eligibility",
    question: "What are the eligibility criteria for admission?",
    answer:
      "Sample data: Eligibility varies by program. Typical requirements include completion of the prior qualifying degree, minimum percentage, and any program-specific subject prerequisites.",
    tags: ["admissions", "eligibility", "requirements"],
  },
  {
    id: "admissions-documents",
    question: "What documents are required for admission?",
    answer:
      "Sample data: Common documents include transcripts/marks cards, ID proof, passport-size photos, migration/transfer certificate (if applicable), and category certificates.",
    tags: ["admissions", "documents", "requirements"],
  },
  {
    id: "admissions-process",
    question: "What is the admission process?",
    answer:
      "Sample data: Apply online, submit documents, attend any required entrance test/interview, receive an offer, and complete fee payment to confirm the seat.",
    tags: ["admissions", "process", "steps"],
  },
  {
    id: "entrance-test",
    question: "Is there an entrance test?",
    answer:
      "Sample data: Some programs require an entrance test and/or interview. Check your program page for the exact selection components.",
    tags: ["admissions", "entrance", "test", "interview"],
  },
  {
    id: "application-fee",
    question: "What is the application fee?",
    answer:
      "Sample data: The application fee is program-specific and is paid during online submission. The fee is generally non‑refundable.",
    tags: ["admissions", "application", "fee"],
  },
  {
    id: "fees-payment",
    question: "How can I pay tuition fees?",
    answer:
      "Sample data: Tuition fees can be paid online through the student portal using net banking, UPI, or card. Offline payments may be accepted at the accounts office.",
    tags: ["fees", "payment", "tuition", "accounts"],
  },
  {
    id: "first-year-fees",
    question: "What are the first-year fees?",
    answer:
      "Sample data fee breakdown:\n\n• 1st Year: ₹2,00,000\n• 2nd Year: ₹2,00,000\n• 3rd Year: ₹2,30,000\n• 4th Year: ₹2,30,000\n\nIf you need the official fee sheet, contact the Admissions or Accounts office.",
    tags: ["fees", "first year", "fee structure", "tuition"],
  },
  {
    id: "fee-structure",
    question: "Where can I find the fee structure?",
    answer:
      "Sample data: The fee structure is published on the admissions portal and in program-specific notifications. If you need a detailed breakup, contact the Finance/Accounts office.",
    tags: ["fees", "fee structure", "admissions", "accounts"],
  },
  {
    id: "hostel-fees",
    question: "What are the hostel fees?",
    answer:
      "Sample data: Hostel fees depend on room type and campus. Refer to the hostel and dining page for the latest charges and inclusions.",
    tags: ["hostel", "fees", "dining"],
  },
  {
    id: "refund-policy",
    question: "What is the fee refund policy?",
    answer:
      "Sample data: Refunds follow the university’s official policy and timelines. Please review the admissions notification or contact the Accounts office for current rules.",
    tags: ["fees", "refund", "policy"],
  },
  {
    id: "exam-schedule",
    question: "Where can I find the exam schedule?",
    answer:
      "Sample data: Exam schedules are published on the examination page and the student portal. Notifications are sent to your registered email.",
    tags: ["exam", "schedule", "examination"],
  },
  {
    id: "hostel-rules",
    question: "What are the hostel rules?",
    answer:
      "Sample data: Hostel rules include entry/exit timings, visitor policies, and code of conduct. Refer to the hostel and dining page for the latest rules.",
    tags: ["hostel", "rules", "dining", "campus"],
  },
  {
    id: "id-card",
    question: "How do I get my student ID card?",
    answer:
      "Sample data: Student ID cards are issued after enrollment and document verification. Contact the student services office for collection timelines.",
    tags: ["id", "card", "student services"],
  },
  {
    id: "wifi-access",
    question: "How do I access campus Wi‑Fi?",
    answer:
      "Sample data: Use your university email credentials to sign in to the campus Wi‑Fi network. If access fails, raise a ticket with IT support.",
    tags: ["wifi", "it", "network"],
  },
];

const normalize = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

export function searchMockFaqs(query: string) {
  const q = normalize(query);
  if (!q) return null;

  let best: { item: MockFaq; score: number } | null = null;

  for (const item of MOCK_FAQS) {
    const hay = normalize(`${item.question} ${item.tags.join(" ")}`);
    let score = 0;
    for (const token of q.split(" ")) {
      if (token.length < 3) continue;
      if (hay.includes(token)) score += 1;
    }
    if (!best || score > best.score) {
      best = { item, score };
    }
  }

  if (best && best.score >= 2) {
    return best.item;
  }

  return null;
}

export function rankMockFaqs(query: string, limit = 5) {
  const q = normalize(query);
  if (!q) return [];

  const scored = MOCK_FAQS.map((item) => {
    const hay = normalize(`${item.question} ${item.tags.join(" ")}`);
    let score = 0;
    for (const token of q.split(" ")) {
      if (token.length < 3) continue;
      if (hay.includes(token)) score += 1;
    }
    return { item, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);

  return scored;
}
