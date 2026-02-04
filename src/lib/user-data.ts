const USER_CALENDAR_TEXT = `May 2025
19 (Mon) Reopening for Faculty for AY-2025-26 (19-24) Faculty Development programme (26-31) Research, research plan submission Course plan preparation and entry in ERP
26 (Mon) Inauguration and commencement of classes for MBA first year batch 2025-26
24 (Sat) Convocation-Bangalore Bannerghatta Road Campus
25 (Sun) Convocation-Bangalore Kengeri Campus
25 (Sun) Convocation-Bangalore Yeshwanthpur Campus
29, 30, 31 (Thu, Fri, Sat) Convocation-Bangalore Central Campus
31 (Sat) Inauguration and Commencement of MBA (Executive) Second Year batch 2025-26
June 2025
02 (Mon) Commencement of classes for V/VII/IX semester UG & IV trimester PG-Bangalore Central campus
02 (Mon) Commencement of classes for III/V/VII/IX semester UG & and III semester PG-Bangalore Kengeri campus
02 (Mon) Commencement of classes for III, V semester UG & III semester PG - Bangalore Bannerghatta Road Campus
03 (Tue) Commencement of classes for III semester UG & and III semester PG- Bangalore central campus
04 (Wed) Commencement of classes for III/V semester UG & and III semester PG- Bangalore Yeshwanthpur campus
02 (Mon) 09:30 AM-IV Trimester MBA second year batch, All Bangalore campuses
June 2025 (additional inaugurations and orientations for UG/PG across campuses)
July 2025
(14-16) Mid Trimester Examinations for I and IV Trimesters-MBA
August 2025
(04-09) Mid Semester Examinations for I, III, V, VII, IX Semester UG and I and III Semester PG Programmes
September 2025
(01-02) Natakam - University Theatre Day Central Campus
October 2025
(03-18) End Semester Examinations for I, III, V, VII, IX Semester UG and I and III Semester PG Programmes
November 2025
Commencement of Even semester II, IV, VI, VIII, X Semester UG and II and IV Semester PG Programmes
December 2025
(05-06) Annual Athletic Meet-Central campus
January 2026
Commencement of classes for all UG & PG-Bangalore campuses
February 2026
(16 March-02 April) End Semester Examinations for Even (II, IV, VI, VIII, X) Semester UG and II and IV Semester PG Programmes
March 2026
End Trimester examination for III and VI Trimester-MCA, MSAIM, MSc (Data Science) & MSc (Statistics)
April 2026
(08-15) End Trimester Examinations for CBCS, January Trimester programmes
May 2026
01 (Fri) Holiday May Day
June 2026
01 (Mon) Reopening for AY 2026-27 for senior students
Odd semester AY 2025-26: Total working days = 93 (including Mid semester exam days)
Even semester: Total teaching days = 96 (including Mid semester exam days)
`; 

const normalize = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

export function getUserDataContext(query: string, maxChars = 2000) {
  const q = normalize(query);
  if (!q) return "";

  const lines = USER_CALENDAR_TEXT.split("\n");
  const tokens = q.split(" ").filter((t) => t.length > 2);

  const matched = lines.filter((line) => {
    const hay = normalize(line);
    return tokens.some((t) => hay.includes(t));
  });

  const context = matched.join("\n").slice(0, maxChars);
  return context;
}

export const USER_DATA_SOURCE_LABEL = "User-provided dataset";
