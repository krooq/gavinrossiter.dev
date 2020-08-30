import React from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, ThemeProvider, List, ListItem, ListItemIcon, ListItemText, ListItemProps, Chip, Card, CardContent, CssBaseline, Box, Button, Link } from "@material-ui/core";
import "fontsource-bungee";
import resumeData from './data/resume.json';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import WebIcon from '@material-ui/icons/Web';
import MyLocationIcon from '@material-ui/icons/MyLocation';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#1e1e1e',
            light: '#454545',
            dark: '#000000',
        },
        background: {
            default: "#1e1e1e",
            paper: "#282829",
        },
        secondary: {
            main: '#cddce5',
            light: '#ffffff',
            dark: '#9caab3',
        },
    },
});
theme.typography.h1 = {
    fontSize: '2.5rem',
    lineHeight: '2.5rem',
    '@media (min-width:800px)': {
        fontSize: '4rem',
        lineHeight: '4rem'
    },
    fontFamily: "Bungee"
};
const useStyles = makeStyles((theme) => ({
    landing: {
        background: 'url(./images/nasa.jpg) #00000080 no-repeat center center',
        backgroundBlendMode: 'darken',
        backgroundSize: 'cover',
        height: '100vh',
        padding: '0',
        maxWidth: '100%',
        minHeight: '100%'
    },
    prelude: {
        color: '#9caab3',
        whiteSpace: 'pre-wrap'
    },
    title: {
        paddingTop: '32px',
    },
    landingContent: {
        height: '100%'
    },
    chip: {
        margin: theme.spacing(0.5),
        fontWeight: 'bold'
    }
}))


function Home() {
    const classes = useStyles();
    const content = {
        prelude: "I'm working\nto solve todays\nbiggest problem",
        title: "Human\nAI\nsymbiosis",
    }
    return (
        <React.Fragment>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Landing classes={classes} data={content} />
                <Resume classes={classes} data={resumeData} />
            </ThemeProvider>
        </React.Fragment >
    )
}

function Landing(props: any) {
    const classes = props.classes
    const data = props.data
    return <Container className={classes.landing}>
        <Grid container justify="center" alignItems="center" className={classes.landingContent}>
            <Grid item>
                <Typography variant="h1" className={classes.prelude}>{data.prelude}</Typography>
                <Typography variant="h1" style={{ whiteSpace: 'pre-wrap' }}>{data.title}</Typography>
            </Grid>
        </Grid>
    </Container>;
}

function Resume(props: any) {
    const classes = props.classes;
    const data = props.data;
    return (
        <Container>
            <Grid container item xs={12} justify="flex-end" alignItems="center">
                <Button href="https://gavinrossiter.dev/resume">printable version</Button>
            </Grid>
            <Grid container spacing={4}>
                <Grid item container xs={12} justify="center">
                    <Name classes={classes} data={data} />
                </Grid>
                <Grid item xs={12} >
                    <Card >
                        <CardContent>
                            <Contact data={data} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>About Me</Typography>
                            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{data.about}</Typography>
                            <br />
                            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{data.goals}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={6}>
                    <Work data={data} />
                </Grid>
                <Grid item md={6}>
                    <Education data={data} />
                </Grid>
                <Grid item md={6}>
                    <ProjectCardList title="Projects" content={props.data.projects} />
                </Grid>
                <Grid item md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>Programming Languages</Typography>
                            {data.technical.languages.map((d: string) => <Chip color='secondary' className={classes.chip} key={d} label={d} />)}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

type ExperienceData = { start: string, end: string, title: string, domains: Array<string>, organization: string, location: string }

function ExperienceCardList(props: any) {
    const title: string = props.title;
    const content: Array<ExperienceData> = props.content;
    return (<Card >
        <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>{title}</Typography>
            <Grid container spacing={4}>
                {content.map((data: any) =>
                    <Grid xs={12} item>
                        <ExperienceCard data={data} />
                    </Grid>
                )}
            </Grid>
        </CardContent>
    </Card>
    );
}

function ExperienceCard(props: any) {
    const data: ExperienceData = props.data
    return (
        <Box boxShadow={1}>
            <Card >
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>{data.start} - {data.end}</Typography>
                    <Typography variant="h6" component="h1">{data.title}</Typography>
                    <Typography variant="subtitle1" component="p">{data.domains.join(", ")}</Typography>
                    <Typography variant="body2" component="p">{data.organization}</Typography>
                    <Typography variant="body2" component="p">{data.location}</Typography>
                </CardContent>
            </Card>
        </Box>
    )
}
function ProjectCardList(props: any) {
    const title: string = props.title;
    const content = props.content;
    return (<Card >
        <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>{title}</Typography>
            <Grid container spacing={4}>
                {content.map((data: any) =>
                    <Grid xs={12} item>
                        <ProjectCard data={data} />
                    </Grid>
                )}
            </Grid>
        </CardContent>
    </Card>
    );
}

function ProjectCard(props: any) {
    const data = props.data
    return (
        <Box boxShadow={1}>
            <Card >
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>{data.end}</Typography>
                    <Typography variant="h6" component="h1">{data.title}</Typography>
                    {data.organization != null && <Typography variant="subtitle1" component="p">{data.organization}</Typography>}
                    <Typography variant="body1" component="p">{data.description}</Typography>
                    <Link variant="body1" color="inherit" href={data.link}>{data.link}</Link>
                </CardContent>
            </Card>
        </Box >
    )
}

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
    return <ListItem button component="a" {...props} />;
}

function Name(props: any) {
    const data = props.data
    const classes = props.classes
    return <Typography variant="h2" className={classes.title} gutterBottom>{data.name}</Typography>;
}

function Contact(props: any) {
    const data = props.data
    return (
        <List dense>
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

function Work(props: any) {
    return <ExperienceCardList title="Work" content={props.data.work} />
}


function Education(props: any) {
    return <ExperienceCardList title="Education" content={props.data.education} />
}

export default Home;
