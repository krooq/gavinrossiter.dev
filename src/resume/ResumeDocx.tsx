// Generate a CV
// Import from 'docx' rather than '../build' if you install from npm
import { AlignmentType, Document, HeadingLevel, IParagraphOptions, IRunOptions, ITableCellOptions, ITableRowOptions, Packer, Paragraph, Table, TableCell, TableRow, TabStopPosition, TabStopType, TextRun, WidthType } from "docx";
import React from "react";
import { Button } from "@material-ui/core";
// tslint:disable:no-shadowed-variable
import { saveAs } from "file-saver";

function CreateResumeDocument(props: any): Document {
    const { contact, employment, education, projects, skills } = props

    const document = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Calibri"
                    }
                }
            }
        }
    });

    document.addSection({
        children: [
            ...titleSection(contact),
            ...contactSection("Contact", contact),
            ...experienceSection("Employment", employment),
            ...experienceSection("Education", education),
            ...experienceSection("Projects", projects),
            ...skillsSection("Skills", skills),
        ]
    });

    return document;
}


function titleSection(contact: any) {
    return [p(contact.name, { heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER },),]
}

function contactSection(title: string, contact: any) {
    return [
        title && contact && p(title, { ...h3, ...hr }),
        p(`Phone: \t${contact.phone}`, tb),
        p(`Email: \t${contact.email}`, tb),
        p(`Website: \t${contact.website}`, tb),
        p(`LinkedIn: \t${contact.linkedin}`, tb),
        p(`GitHub: \t${contact.github}`, tb),
    ]
}

function experienceSection(title: string, items: any) {
    return [
        title && items && items.length > 0 && p(title, { ...h3, ...hr }),
        ...items.flatMap((i: any) => [
            i?.title && experienceTitle(i.title, `${i.start} - ${i.end}`),
            i?.organization && p(i.organization),
            i?.domains && p(`${i.domains.join(', ')}`),
            i?.description && p(i.description),
            i?.link && p(i.link),
            ...(i?.notes ? i.notes.map((n: any) => p(n, li)) : []),
        ].filter(i => i !== null))
    ]
}

function skillsSection(title: string, skills: any) {
    const { languages, tools, frameworks, notes } = skills
    return [
        title && skills && p(title, { ...h3, ...hr }),
        languages && p("Languages", { ...h5 }),
        languages?.expert && p(`Expert: ${languages.expert.join(', ')}`),
        languages?.productive && p(`Productive: ${languages.productive.join(', ')}`),
        languages?.familiar && p(`Familiar: ${languages.familiar.join(', ')}`),
        tools && p("Tools", { ...h5 }),
        tools && p(`${tools.join(', ')}`),
        frameworks && p("Frameworks", { ...h5 }),
        frameworks && p(`${frameworks.join(', ')}`),
        ...(notes ? notes.map((n: any) => p(n, li)) : []),
    ].filter(i => i !== null)
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

    return p([
        s({ text: title, ...b }),
        s({ text: `\t${date} `, ...b }),
    ], {
        keepNext: true,
        keepLines: true,
        rightTabStop: TabStopPosition.MAX,
        ...h5
    });
}

// Paragraph Options
const hr: IParagraphOptions = { border: { bottom: { color: "auto", space: 1, value: "single", size: 6, } } }
const h3: IParagraphOptions = { heading: HeadingLevel.HEADING_3, spacing: { before: 150 } }
const h5: IParagraphOptions = { heading: HeadingLevel.HEADING_5, spacing: { before: 75 } }
const tb: IParagraphOptions = { tabStops: [{ type: TabStopType.LEFT, position: 1000, },] }
const li: IParagraphOptions = { bullet: { level: 0, } };

// TextRun Options
const em: IRunOptions = { italics: true }
const b: IRunOptions = { bold: true }

function p(spans: string | TextRun[], paragraphOpts: IParagraphOptions = {}): Paragraph {
    const text = typeof spans === 'string' ? [new TextRun(spans)] : spans
    return new Paragraph({ children: text, ...paragraphOpts });
}
function s(textOpts: string | IRunOptions = {}) {
    return new TextRun(textOpts)
}
function tr(opts: TableCell[] | ITableRowOptions = []) {
    return new TableRow('children' in opts ? opts : { children: opts });
}
function td(opts: Paragraph[] | ITableCellOptions = []) {
    return new TableCell('children' in opts ? opts : { children: opts });
}


// tslint:disable-next-line:no-any
function createPositionDateText(startDate: any, endDate: any, isCurrent: boolean): string {
    const startDateText = getMonthFromInt(startDate.month) + ". " + startDate.year;
    const endDateText = isCurrent ? "Present" : `${getMonthFromInt(endDate.month)}.${endDate.year} `;

    return `${startDateText} - ${endDateText} `;
}

function getMonthFromInt(value: number): string {
    switch (value) {
        case 1:
            return "Jan";
        case 2:
            return "Feb";
        case 3:
            return "Mar";
        case 4:
            return "Apr";
        case 5:
            return "May";
        case 6:
            return "Jun";
        case 7:
            return "Jul";
        case 8:
            return "Aug";
        case 9:
            return "Sept";
        case 10:
            return "Oct";
        case 11:
            return "Nov";
        case 12:
            return "Dec";
        default:
            return "N/A";
    }
}

export function GenerateAndDownloadResumeAsDocx(props: any) {
    const { filename } = props
    Packer.toBlob(CreateResumeDocument(props)).then((blob) => {
        saveAs(blob, filename);
    })
}

export function DownloadResumeAsWordButton(props: any) {
    return <Button onClick={e => GenerateAndDownloadResumeAsDocx(props)} >Download as Word doc</Button>
}

export default DownloadResumeAsWordButton;

