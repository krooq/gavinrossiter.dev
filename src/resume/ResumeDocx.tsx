// Generate a CV
// Import from 'docx' rather than '../build' if you install from npm
import {
  AlignmentType,
  Document,
  HeadingLevel,
  IParagraphOptions,
  IRunOptions,
  ITableCellOptions,
  ITableRowOptions,
  Packer,
  Paragraph,
  TableCell,
  TableRow,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";
import React from "react";
import { Button } from "@material-ui/core";
// tslint:disable:no-shadowed-variable
import { saveAs } from "file-saver";
import contact from "resources/about/contact.json";
import employment from "resources/about/employment.json";
import education from "resources/about/education.json";
import projects from "resources/about/projects.json";
import skills from "resources/about/skills.json";
import about from "resources/about/about.json";
function CreateResumeDocument(): Document {
  const document = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
          },
        },
      },
    },
  });

  document.addSection({
    children: [
      ...titleSection(contact),
      ...contactSection("Contact", contact),
      ...aboutSection("About", about),
      ...skillsSection("Skills", skills),
      ...experienceSection("Employment", employment),
      ...experienceSection("Education", education),
      ...experienceSection("Projects", projects),
    ],
  });

  return document;
}

function titleSection(contact: any) {
  return [
    p(contact.name, {
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
  ];
}

function contactSection(title: string, contact: any) {
  return [
    title && contact && p(title, { ...h3, ...hr }),
    p(`Phone: \t${contact.phone}`, tb),
    p(`Email: \t${contact.email}`, tb),
    p(`Website: \t${contact.website}`, tb),
    p(`LinkedIn: \t${contact.linkedin}`, tb),
    p(`GitHub: \t${contact.github}`, tb),
  ];
}

function aboutSection(title: string, about: any) {
  return [
    title && about && p(title, { ...h3, ...hr }),
    ...about.map((para: any) => p(`${para.join(" ")}`)),
  ].filter((i) => i !== null);
}

function experienceSection(title: string, items: any) {
  return [
    title && items && items.length > 0 && p(title, { ...h3, ...hr }),
    ...items.flatMap((i: any) =>
      [
        i?.title && experienceTitle(i.title, `${i.start} - ${i.end}`),
        i?.organization && p(i.organization),
        i?.domains && p(`${i.domains.join(", ")}`),
        i?.description && p(i.description),
        i?.link && p(i.link),
        ...(i?.notes ? i.notes.map((n: any) => p(n, li)) : []),
      ].filter((i) => i !== null)
    ),
  ];
}

function skillsSection(title: string, skills: any) {
  const { languages, tools, frameworks, notes } = skills;
  return [
    title && skills && p(title, { ...h3, ...hr }),
    languages && p("Programming Languages", { ...h5 }),
    languages?.expert && p(`Expert: ${languages.expert.join(", ")}`),
    languages?.productive &&
      p(`Productive: ${languages.productive.join(", ")}`),
    languages?.familiar && p(`Familiar: ${languages.familiar.join(", ")}`),
    tools && p("Tools", { ...h5 }),
    tools && p(`${tools.join(", ")}`),
    frameworks && p("Frameworks", { ...h5 }),
    frameworks && p(`${frameworks.join(", ")}`),
    ...(notes ? notes.map((n: any) => p(n, li)) : []),
  ].filter((i) => i !== null);
}

function experienceTitle(title: string, date: string) {
  // return new Table({
  //     width: { size: TabStopPosition.MAX, type: WidthType.DXA },
  //     rows: [
  //         tr([
  //             td(
  //                 [p({ text: title, ...b })
  //                 ]),
  //             td({
  //                 children: [
  //                     p({ text: date, ...b })],
  //             })
  //         ])
  //     ],
  // });

  return p([s({ text: title, ...b }), s({ text: `\t${date} `, ...b })], {
    keepNext: true,
    keepLines: true,
    rightTabStop: TabStopPosition.MAX,
    ...h5,
  });
}

// Paragraph Options
export const hr: IParagraphOptions = {
  border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
};
export const h3: IParagraphOptions = {
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 150 },
};
export const h5: IParagraphOptions = {
  heading: HeadingLevel.HEADING_5,
  spacing: { before: 75 },
};
export const tb: IParagraphOptions = {
  tabStops: [{ type: TabStopType.LEFT, position: 1000 }],
};
export const li: IParagraphOptions = { bullet: { level: 0 } };

// TextRun Options
export const em: IRunOptions = { italics: true };
export const b: IRunOptions = { bold: true };

export function p(
  spans: string | TextRun[],
  paragraphOpts: IParagraphOptions = {}
): Paragraph {
  const text = typeof spans === "string" ? [new TextRun(spans)] : spans;
  return new Paragraph({ children: text, ...paragraphOpts });
}
export function s(textOpts: string | IRunOptions = {}) {
  return new TextRun(textOpts);
}
export function tr(opts: TableCell[] | ITableRowOptions = []) {
  return new TableRow("children" in opts ? opts : { children: opts });
}
export function td(opts: Paragraph[] | ITableCellOptions = []) {
  return new TableCell("children" in opts ? opts : { children: opts });
}

export function GenerateAndDownloadResumeAsDocx(props: any) {
  const { filename } = props;
  Packer.toBlob(CreateResumeDocument()).then((blob) => {
    saveAs(blob, filename);
  });
}

export function DownloadResumeAsWordButton(props: any) {
  return (
    <Button onClick={(e: any) => GenerateAndDownloadResumeAsDocx(props)}>
      .docx
    </Button>
  );
}

export default DownloadResumeAsWordButton;
