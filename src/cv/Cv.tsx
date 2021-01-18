import React from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, ThemeProvider, CssBaseline, Hidden, Link, Box } from "@material-ui/core";
import resumeData from '../data/resume.json';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import '../index.css'
import { Contact } from "../common/Components"
import { textBlock } from "../common/Util"

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
    typography: {
        fontSize: 11,
        allVariants: {
            lineHeight: 1.4,
        },
        overline: {
            fontWeight: 'bold',
            textDecoration: 'underline'
        },
        h6: {
            fontWeight: 'bold'
        },
        fontFamily: 'Computer Modern Serif'
    }
});

const useStyles = makeStyles((theme) => ({
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

function Resume() {
    const classes = useStyles()
    const data = resumeData;
    const avatar = false
    const props = { classes, data, avatar }
    return (
        <React.Fragment>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Container>
                    <Grid container alignItems="center">
                        <Grid item sm={6}><Typography variant="h2">{data.name}</Typography></Grid>
                        <Hidden smUp><Grid item container sm={6} ><Contact {...props} /></Grid></Hidden>
                        <Hidden xsDown><Grid item container sm={6} justify="flex-end"><Contact {...props} /></Grid></Hidden>
                    </Grid>
                    <Typography variant="h6" gutterBottom>About Me</Typography>
                    <hr />
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(data.about)}</Typography>
                    <br />
                    <br />
                    <ExperienceTimeline {...props} title="Work" data={data.work} />
                    <ExperienceTimeline {...props} title="Education" data={data.education} />
                    <ProjectTimeline {...props} title="Projects" data={data.projects} />
                    <br />
                    <Typography className={classes.print} variant="h6" gutterBottom >Technical</Typography>
                    <hr />
                    <Typography variant="overline" gutterBottom>Summary</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(data.technical.summary, "\n")}</Typography>
                    <br />
                    <Typography variant="overline" gutterBottom>Strengths</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(data.technical.strengths, "\n")}</Typography>
                    {/* <br />
                    <Typography variant="overline" gutterBottom>Weaknesses</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(data.technical.weaknesses, "\n")}</Typography> */}
                    <br />
                    <Typography variant="overline">Primary languages</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{data.technical.languages.primary.join("\n")}</Typography>
                    <br />
                    <Typography variant="overline">Secondary languages</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{data.technical.languages.secondary.join("\n")}</Typography>
                    <br />
                    <Typography variant="overline" gutterBottom>Paradigms</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{data.technical.paradigms.join("\n")}</Typography>
                    <br />
                    <Typography variant="overline" gutterBottom>Tools</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{data.technical.tools.join("\n")}</Typography>
                    <br />
                    <Typography variant="overline" gutterBottom>Libraries and Frameworks</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{data.technical.ecosystem.join("\n")}</Typography>
                    <br />
                </Container>
            </ThemeProvider >
        </React.Fragment >
    )
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
