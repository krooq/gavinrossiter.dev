import React from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, ThemeProvider, List, ListItem, ListItemIcon, ListItemText, ListItemProps, CssBaseline, Hidden, Link, Box } from "@material-ui/core";
import "fontsource-bungee";
import resumeData from './data/resume.json';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import WebIcon from '@material-ui/icons/Web';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
    typography: {
        fontSize: 12,
    }
});

const useStyles = makeStyles((theme) => ({
    name: {},
    timeline: {
        padding: 0
    }
}))


function Resume() {
    const classes = useStyles();
    const data = resumeData;
    return (
        <React.Fragment>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Container>
                    <Grid container alignItems="center">
                        <Grid item sm={6}><Typography variant="h2" className={classes.name}>{data.name}</Typography></Grid>
                        <Hidden smUp><Grid item container sm={6} ><Contact data={data} /></Grid></Hidden>
                        <Hidden xsDown><Grid item container sm={6} justify="flex-end"><Contact data={data} /></Grid></Hidden>
                    </Grid>
                    <Typography variant="h6" gutterBottom>About Me</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{data.about}</Typography>
                    <br />
                    <ExperienceTimeline className={classes.timeline} title="Work" data={data.work} />
                    <ExperienceTimeline className={classes.timeline} title="Education" data={data.education} />
                    <ProjectTimeline className={classes.timeline} title="Projects" data={data.projects} />
                    <br />
                    <Typography variant="h6" gutterBottom>Programming Languages</Typography>
                    <Typography variant="body1">{data.technical.languages.join(", ")}</Typography>
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
            <Timeline {...props}>{data.map((d: any) => <ExperienceTimelineItem data={d} />)}</Timeline>
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
            <Timeline {...props}>{data.map((d: any) => <ProjectTimelineItem data={d} />)}</Timeline>
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
function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
    return <ListItem button component="a" {...props} />;
}


function Contact(props: any) {
    const data = props.data
    return (
        <List dense style={{ flexGrow: 0 }}>
            <ListItemLink href={data.website}>
                <ListItemIcon><WebIcon /></ListItemIcon>
                <ListItemText primary={data.website} />
            </ListItemLink>
            <ListItemLink href={data.github}>
                <ListItemIcon><GitHubIcon /></ListItemIcon>
                <ListItemText primary={data.github} />
            </ListItemLink>
            <ListItemLink href={data.linkedin}>
                <ListItemIcon><LinkedInIcon /></ListItemIcon>
                <ListItemText primary={data.linkedin} />
            </ListItemLink>
            <ListItemLink href="https://www.google.com/maps/place/Melbourne+VIC">
                <ListItemIcon><MyLocationIcon /></ListItemIcon>
                <ListItemText primary={data.location} />
            </ListItemLink>
        </List>
    )
}
export default Resume;
