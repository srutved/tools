import { SAMPLE_RESUME } from "@/tools/resume-builder/sample";
import type { CoverLetter } from "./schema";

/** Realistic example letter for thumbnails, the templates page and "Load example". */
export const SAMPLE_COVER_LETTER: CoverLetter = {
  templateId: SAMPLE_RESUME.templateId,
  basics: SAMPLE_RESUME.basics,
  date: "2026-10-13",
  recipient: {
    name: "Ms. Anita Rao",
    title: "Head of Engineering",
    company: "Brightpath Learning",
    address: "8th Floor, Prestige Tech Park\nBengaluru, Karnataka 560103",
  },
  subject: "Application for Senior Frontend Engineer",
  greeting: "Dear Ms. Rao,",
  body: [
    "I'm writing to apply for the Senior Frontend Engineer role at Brightpath Learning. Your mission of making quality education affordable is one I care about deeply, and I'd love to help build the product that delivers it to millions of students.",
    "At Northwind Commerce I lead a team of five engineers. We rebuilt the checkout in Next.js, lifting conversion by 18%, and cut page load time from 4.2 to 1.3 seconds. I also built the design system now used by nine product teams, which taught me how to make shared components that people actually enjoy using.",
    "Brightpath's learners often study on low-cost phones and patchy connections. Performance and accessibility have been the focus of my work for six years, and I'd bring the same discipline to keeping your app fast and usable for every student.",
    "I'd welcome the chance to discuss how I can contribute. Thank you for your time and consideration.",
  ].join("\n\n"),
  closing: "Sincerely,",
};
