import { shuffle } from "../data/miniGames";

// Ebeveynin yüklediği tüm testlerden aynı dersteki soruları toplayıp
// KARIŞTIRARAK yeni, tekrar oynanabilir bir pratik testi üretir.
// Böylece ebeveyn her gün 10 ayrı test yazmak zorunda kalmadan, çocuk
// aynı haftanın konularından istediği kadar (sınırsız) pratik yapabilir.
export function generatePracticeTest(subject, allTests, desiredCount = 8) {
  const subjectTests = allTests.filter((t) => t.subject === subject);
  if (subjectTests.length === 0) return null;

  const pool = subjectTests.flatMap((t) => t.questions.map((q) => ({ ...q, _sourceTitle: t.title })));
  if (pool.length === 0) return null;

  const shuffledPool = shuffle(pool);
  const count = Math.min(desiredCount, pool.length);
  const selected = shuffledPool.slice(0, count).map((q, i) => ({ ...q, id: `pq${i}` }));

  const targetSecondsPerQuestion = subjectTests.find((t) => t.targetSecondsPerQuestion)?.targetSecondsPerQuestion || 40;
  const hintsAllowed = Math.max(1, Math.min(...subjectTests.map((t) => t.hintsAllowed ?? 2)));

  return {
    id: `practice-${subject}-${Date.now()}`,
    subject,
    title: `${subject} Pratik Testi 🔄`,
    week: null,
    isPractice: true,
    targetSecondsPerQuestion,
    hintsAllowed,
    questions: selected,
  };
}

export function getAvailableSubjects(allTests) {
  return [...new Set(allTests.map((t) => t.subject))];
}
