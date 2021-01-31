import React, { useEffect } from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, ThemeProvider, CssBaseline, Hidden, Link, Box } from "@material-ui/core";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import '../index.css'
import { Contact } from "../common/Components"
import { textBlock } from "../common/Util"

const useStyles = makeStyles((theme) => ({
    resume: {
        marginTop: theme.spacing(4)
    },
    timeline: {
        padding: 0,
        "& .MuiTimelineContent-root, & .MuiTimelineOppositeContent-root": {
            padding: "4px 16px",

        },
        "& .MuiTimelineItem-root": {
            minHeight: "0px",
        },
    },
    table: {
        '& .MuiTableCell-head': {
            padding: 0
        },
        '& .MuiTableCell-body': {
            padding: 0,
            border: 0
        }
    },
    print: {
        '@media print': {
            display: 'block',
            pageBreakBefore: 'always',
        },
    },
}))

function Resume(props: any) {
    const classes = useStyles()
    const { contact, experience, education, projects, skills } = props
    const avatar = false
    props = { ...props, classes, data: contact, avatar }

    return contact && experience && education && projects && skills
        ? <React.Fragment>
            <CssBaseline />
            <Container className={classes.resume}>
                <ExperienceTimeline {...props} title="Experience" data={experience} />
                <ExperienceTimeline {...props} title="Education" data={education} />
                <ProjectTimeline {...props} title="Projects" data={projects} />
                <br />
                <Typography className={classes.print} variant="h6" gutterBottom >Skills</Typography>
                <hr />
                <Typography variant="overline" gutterBottom>Summary</Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(skills.summary, "\n")}</Typography>
                <br />
                <Typography variant="overline" gutterBottom>Strengths</Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(skills.strengths, "\n")}</Typography>
                <br />
                <Typography variant="overline">Primary languages</Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{skills.languages.primary.join("\n")}</Typography>
                <br />
                <Typography variant="overline">Secondary languages</Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{skills.languages.secondary.join("\n")}</Typography>
                <br />
                <Typography variant="overline" gutterBottom>Paradigms</Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{skills.paradigms.join("\n")}</Typography>
                <br />
                <Typography variant="overline" gutterBottom>Tools</Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{skills.tools.join("\n")}</Typography>
                <br />
                <Typography variant="overline" gutterBottom>Libraries and Frameworks</Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{skills.ecosystem.join("\n")}</Typography>
                <br />
            </Container>
        </React.Fragment >
        : <React.Fragment />
}

type ExperienceData = { start: string, end: string, title: string, domains: Array<string>, organization: string, location: string }

function ExperienceTimeline(props: any) {
    const title: string = props.title;
    const data: Array<ExperienceData> = props.data;
    return (
        <React.Fragment>
            <Typography variant="h6" component="h2">{title}</Typography>
            <hr />
            <Timeline className={props.classes.timeline}>{data.map((d: any) => <ExperienceTimelineItem data={d} />)}</Timeline>
        </React.Fragment >
    )
}

function ExperienceTimelineItem(props: any) {
    const data: ExperienceData = props.data
    return (
        <TimelineItem>
            <TimelineContent style={{ flex: "none", width: "8rem" }}>
                <Typography variant="subtitle2" align="right">{data.start} - {data.end}</Typography>
            </TimelineContent>
            <TimelineOppositeContent style={{ flexGrow: 1, }}>
                <Typography variant="body1" component="h1" align="left">{data.title}</Typography>
                <Typography variant="body2" component="p" align="left">{data.domains.join(", ")}</Typography>
                <Typography variant="body2" component="p" align="left">{data.organization} ({data.location})</Typography>
            </TimelineOppositeContent>
        </TimelineItem >
    )
}

function ProjectTimeline(props: any) {
    const title: string = props.title;
    const data = props.data;
    return (
        <React.Fragment>
            <Typography variant="h6" component="h2">{title}</Typography>
            <hr />
            <Timeline className={props.classes.timeline}>{data.map((d: any) => <ProjectTimelineItem data={d} />)}</Timeline>
        </React.Fragment >
    )
}

function ProjectTimelineItem(props: any) {
    const data = props.data
    return (
        <TimelineItem>
            <TimelineContent style={{ flex: "none", width: "8rem" }}>
                <Typography variant="subtitle2" align="right">{data.end}</Typography>
            </TimelineContent>
            <TimelineOppositeContent style={{ flexGrow: 1 }}>
                <Typography variant="body1" component="h1" align="left">{data.title}</Typography>
                <Typography variant="body2" component="p" align="left">{data.description}</Typography>
                {data.organiztion != null && <Typography variant="body2" component="p" align="left">{data.organization}</Typography>}
                <Box textAlign="left"><Link variant="body2" href={data.link}>{data.link}</Link></Box>
            </TimelineOppositeContent>
        </TimelineItem >
    )
}

export default Resume;
