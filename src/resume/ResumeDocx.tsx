// Generate a CV
// Import from 'docx' rather than '../build' if you install from npm
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType, TextRun } from "docx";
import React from "react";
import { Button } from "@material-ui/core";
// tslint:disable:no-shadowed-variable
import { saveAs } from "file-saver";

const experiences = [
    {
        isCurrent: true,
        summary: "Full-stack developer working with Angular and Java. Working for the iShares platform",
        title: "Associate Software Developer",
        startDate: {
            month: 11,
            year: 2017,
        },
        company: {
            name: "BlackRock",
        },
    },
    {
        isCurrent: false,
        summary:
            "Full-stack developer working with Angular, Node and TypeScript. Working for the iShares platform. Emphasis on Dev-ops and developing the continous integration pipeline.",
        title: "Software Developer",
        endDate: {
            month: 11,
            year: 2017,
        },
        startDate: {
            month: 10,
            year: 2016,
        },
        company: {
            name: "Torch Markets",
        },
    },
    {
        isCurrent: false,
        summary:
            "Used ASP.NET MVC 5 to produce a diversity data collection tool for the future of British television.\n\nUsed AngularJS and C# best practices. Technologies used include JavaScript, ASP.NET MVC 5, SQL, Oracle, SASS, Bootstrap, Grunt.",
        title: "Software Developer",
        endDate: {
            month: 10,
            year: 2016,
        },
        startDate: {
            month: 3,
            year: 2015,
        },
        company: {
            name: "Soundmouse",
        },
    },
    {
        isCurrent: false,
        summary:
            "Develop web commerce platforms for various high profile clients.\n\nCreated a log analysis web application with the Play Framework in Java, incorporating Test Driven Development. It asynchronously uploads and processes large (2 GB) log files, and outputs meaningful results in context with the problem. \n\nAnalysis  and  development  of  the payment system infrastructure and user accounts section to be used by several clients of the company such as Waitrose, Tally Weijl, DJ Sports, Debenhams, Ann Summers, John Lewis and others.\n\nTechnologies used include WebSphere Commerce, Java, JavaScript and JSP.",
        title: "Java Developer",
        endDate: {
            month: 10,
            year: 2014,
        },
        startDate: {
            month: 3,
            year: 2013,
        },
        company: {
            name: "Soundmouse",
        },
    },
];

const education = [
    {
        degree: "Master of Science (MSc)",
        fieldOfStudy: "Computer Science",
        notes:
            "Exam Results: 1st Class with Distinction, Dissertation: 1st Class with Distinction\n\nRelevant Courses: Java and C# Programming, Software Engineering, Artificial Intelligence, \nComputational Photography, Algorithmics, Architecture and Hardware.\n\nCreated a Windows 8 game in JavaScript for the dissertation. \n\nCreated an award-winning 3D stereoscopic game in C# using XNA.",
        schoolName: "University College London",
        startDate: {
            year: 2012,
        },
        endDate: {
            year: 2013,
        },
    },
    {
        degree: "Bachelor of Engineering (BEng)",
        fieldOfStudy: "Material Science and Engineering",
        notes:
            "Exam Results: 2:1, Dissertation: 1st Class with Distinction\n\nRelevant courses: C Programming, Mathematics and Business for Engineers.",
        schoolName: "Imperial College London",
        startDate: {
            year: 2009,
        },
        endDate: {
            year: 2012,
        },
    },
];

const skills = [
    {
        name: "Angular",
    },
    {
        name: "TypeScript",
    },
    {
        name: "JavaScript",
    },
    {
        name: "NodeJS",
    },
];

const achievements = [
    {
        issuer: "Oracle",
        name: "Oracle Certified Expert",
    },
];

function CreateResumeDocument(props: any): Document {
    const { contact, experience, education, projects, skills } = props

    const document = new Document();

    // Title
    document.addSection(titleSection(contact));
    // Contact
    document.addSection(contactSection(contact));
    // Experience
    document.addSection(experienceSection("Experience", experience));
    // Education
    document.addSection(experienceSection("Education", education));
    // Projects
    document.addSection(experienceSection("Projects", projects));
    // Skills
    // document.addSection(experienceSection("Skills", skills));

    // createHeading("Education"),
    // ...education
    //     .map((e: any) => {
    //         const arr: Paragraph[] = [];
    //         arr.push(
    //             createInstitutionHeader(e.organization, `${e.start} - ${e.end}`),
    //         );
    //         arr.push(createRoleText(`${education.domains} - ${education.title}`));

    //         const bulletPoints = splitParagraphIntoBullets(education.notes);
    //         bulletPoints.forEach((bulletPoint) => {
    //             arr.push(createBullet(bulletPoint));
    //         });

    //         return arr;
    //     })
    //     .reduce((prev: any, curr: any) => prev.concat(curr), []),


    // createContactInfo(contact.phone, contact.linkedin, contact.email),
    // createHeading("Education"),
    // ...educations
    //     .map((education: any) => {
    //         const arr: Paragraph[] = [];
    //         arr.push(
    //             createInstitutionHeader(education.schoolName, `${education.startDate.year} - ${education.endDate.year}`),
    //         );
    //         arr.push(createRoleText(`${education.fieldOfStudy} - ${education.degree}`));

    //         const bulletPoints = splitParagraphIntoBullets(education.notes);
    //         bulletPoints.forEach((bulletPoint) => {
    //             arr.push(createBullet(bulletPoint));
    //         });

    //         return arr;
    //     })
    //     .reduce((prev: any, curr: any) => prev.concat(curr), []),
    // createHeading("Experience"),
    // ...experiences
    //     .map((position: any) => {
    //         const arr: Paragraph[] = [];

    //         arr.push(
    //             createInstitutionHeader(
    //                 position.company.name,
    //                 createPositionDateText(position.startDate, position.endDate, position.isCurrent),
    //             ),
    //         );
    //         arr.push(createRoleText(position.title));

    //         const bulletPoints = splitParagraphIntoBullets(position.summary);

    //         bulletPoints.forEach((bulletPoint) => {
    //             arr.push(createBullet(bulletPoint));
    //         });

    //         return arr;
    //     })
    //     .reduce((prev: any, curr: any) => prev.concat(curr), []),
    // createHeading("Skills, Achievements and Interests"),
    // createSubHeading("Skills"),
    // createSkillList(skills),
    // createSubHeading("Achievements"),
    // ...createAchivementsList(achivements),
    // createSubHeading("Interests"),
    // createInterests("Programming, Technology, Music Production, Web Design, 3D Modelling, Dancing."),
    // createHeading("References"),
    // new Paragraph(
    //     "Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk",
    // ),
    // new Paragraph("More references upon request"),
    // new Paragraph({
    //     text: "This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.",
    //     alignment: AlignmentType.CENTER,
    // }),
    return document;
}

function titleSection(contact: any) {
    return {
        children: [
            new Paragraph({
                text: contact.name,
                heading: HeadingLevel.TITLE,
            }),
        ],
    };
}

function contactSection(contact: any) {
    return {
        children: [
            new Paragraph({ children: [new TextRun({ text: `Mobile: ${contact.phone}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Email: ${contact.email}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Website: ${contact.website}` })] }),
            new Paragraph({ children: [new TextRun({ text: `GitHub: ${contact.github}` })] }),
            new Paragraph({ children: [new TextRun({ text: `LinkedIn: ${contact.linkedin}` })] }),
        ],
    };
}

function experienceSection(title: string, items: any) {
    return {
        children: [
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: title })] }),
            ...items.flatMap((i: any) => [
                i?.title && createInstitutionHeader(i.title, yearInterval(i.start, i.end)),
                i?.organization && createRoleText(i.organization),
                i?.domains && createRoleText(`${i.domains.join(', ')}`),
                i?.description && createRoleText(i.description),
                i?.link && createRoleText(i.link),
            ].filter(i => i !== null))
        ],
    };
}

function skillsSection(title: string, items: any) {
    return {
        children: [
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: title })] }),
            ...items.flatMap((i: any) => [new Paragraph({ children: [new TextRun({ text: i.join(", ") + "." })], })
            ])
        ],
    };
}


function yearInterval(start: string, end: string): string {
    return `${start} - ${end}`;
}

function createContactInfo(phoneNumber: string, profileUrl: string, email: string): Paragraph {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun(`Mobile: ${phoneNumber} | LinkedIn: ${profileUrl} | Email: ${email}`),
            new TextRun({
                text: "Address: 58 Elm Avenue, Kent ME4 6ER, UK",
                break: 1,
            }),
        ],
    });
}

function createHeading(text: string): Paragraph {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1,
        thematicBreak: true,
    });
}

function createSubHeading(text: string): Paragraph {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2,
    });
}

function createInstitutionHeader(orgName: string, dateText: string): Paragraph {
    return new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, },],
        children: [
            new TextRun({ text: orgName, bold: true, }),
            new TextRun({ text: `\t${dateText}`, bold: true, }),
        ],
    });
}

function createRoleText(roleText: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: roleText,
                italics: true,

            }),
        ],
    });
}

function createBullet(text: string): Paragraph {
    return new Paragraph({
        text: text,
        bullet: {
            level: 0,
        },
    });
}

// tslint:disable-next-line:no-any
function createSkillList(skills: any[]): Paragraph {
    return new Paragraph({ children: [new TextRun(skills.map((skill) => skill.name).join(", ") + ".")], });
}

// tslint:disable-next-line:no-any
function createAchivementsList(achivements: any[]): Paragraph[] {
    return achivements.map(
        (achievement) =>
            new Paragraph({
                text: achievement.name,
                bullet: {
                    level: 0,
                },
            }),
    );
}

function createInterests(interests: string): Paragraph {
    return new Paragraph({
        children: [new TextRun(interests)],
    });
}

function splitParagraphIntoBullets(text: string): string[] {
    return text.split("\n\n");
}

// tslint:disable-next-line:no-any
function createPositionDateText(startDate: any, endDate: any, isCurrent: boolean): string {
    const startDateText = getMonthFromInt(startDate.month) + ". " + startDate.year;
    const endDateText = isCurrent ? "Present" : `${getMonthFromInt(endDate.month)}. ${endDate.year}`;

    return `${startDateText} - ${endDateText}`;
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

export function DownloadResumeAsDocx(props: any) {
    const doc = CreateResumeDocument(props)

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, props.filename);
    })
}

export function ResumeDocx(props: any) {
    return <Button onClick={e => DownloadResumeAsDocx(props)} >Download as Word doc</Button>
}

export default ResumeDocx;

