import { SECTION_IDS, type Resume } from "./schema";

/** Realistic example data for template thumbnails, the templates page and "Load an example". */
export const SAMPLE_RESUME: Resume = {
  templateId: "classic-navy",
  basics: {
    name: "Aarav Sharma",
    headline: "Senior Frontend Engineer",
    email: "aarav.sharma@email.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    photo: "",
    links: [
      { id: "l1", label: "LinkedIn", url: "https://linkedin.com/in/aaravsharma" },
      { id: "l2", label: "GitHub", url: "https://github.com/aaravsharma" },
    ],
    details: [],
  },
  summary:
    "Frontend engineer with 6 years of experience building fast, accessible web apps used by millions. I lead small teams and care about design systems and measurable performance wins.",
  experience: [
    {
      id: "e1",
      role: "Senior Frontend Engineer",
      company: "Northwind Commerce",
      location: "Bengaluru",
      startDate: "Mar 2022",
      endDate: "",
      current: true,
      description:
        "Led a team of 5 engineers rebuilding the checkout in Next.js, lifting conversion by 18%\nCut page load time from 4.2s to 1.3s through code splitting and image optimisation\nBuilt a shared design system now used by 9 product teams",
    },
    {
      id: "e2",
      role: "Frontend Engineer",
      company: "Lumen Labs",
      location: "Pune",
      startDate: "Jul 2019",
      endDate: "Feb 2022",
      current: false,
      description:
        "Shipped a real-time analytics dashboard in React and TypeScript for 2,000+ business customers\nIntroduced end-to-end testing, reducing production bugs by 40%\nWorked with designers to make the product WCAG 2.1 AA compliant",
    },
  ],
  education: [
    {
      id: "d1",
      degree: "B.Tech in Computer Science",
      school: "National Institute of Technology, Trichy",
      location: "Tiruchirappalli",
      startDate: "2015",
      endDate: "2019",
      score: "CGPA 8.7/10",
      description: "",
    },
  ],
  skills: [
    { id: "s1", name: "Languages", skills: "TypeScript, JavaScript, HTML, CSS, SQL" },
    { id: "s2", name: "Frameworks", skills: "React, Next.js, Node.js, Tailwind CSS" },
    { id: "s3", name: "Tools", skills: "Git, Figma, Jest, Playwright, AWS" },
  ],
  projects: [
    {
      id: "p1",
      name: "OpenInvoice",
      subtitle: "Open-source invoicing app · Next.js, PostgreSQL",
      link: "github.com/aaravsharma/openinvoice",
      date: "2024",
      description: "Used by 3,000+ freelancers, with 1,200 stars on GitHub",
    },
  ],
  certifications: [
    { id: "c1", name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", date: "2023" },
  ],
  languages: [
    { id: "g1", name: "English", level: "Fluent" },
    { id: "g2", name: "Hindi", level: "Native" },
  ],
  customSections: [],
  sectionOrder: [...SECTION_IDS],
  sectionTitles: {},
  hiddenSections: [],
};
