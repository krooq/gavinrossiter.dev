import React from "react";
import './Home.css';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, ThemeProvider, List, ListItem, ListItemIcon, ListItemText, ListItemProps, Chip, Card, CardContent, CssBaseline } from "@material-ui/core";
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
        margin: theme.spacing(0.5)
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
                <Container className={classes.landing}>
                    <Grid container justify="center" alignItems="center" className={classes.landingContent}>
                        <Grid item>
                            <Typography variant="h1" className={classes.prelude}>{content.prelude}</Typography>
                            <Typography variant="h1" style={{ whiteSpace: 'pre-wrap' }}>{content.title}</Typography>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Resume />
                </Container>
            </ThemeProvider>
        </React.Fragment >
    )
}
function Resume() {
    const classes = useStyles();
    const content = resumeData;
    return (
        <React.Fragment>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h2" className={classes.title}>{content.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <List component="nav" >
                        <ListItemLink href={content.website}>
                            <ListItemIcon><WebIcon /></ListItemIcon>
                            <ListItemText primary={content.website} />
                        </ListItemLink>
                        <ListItemLink href={content.github}>
                            <ListItemIcon><GitHubIcon /></ListItemIcon>
                            <ListItemText primary={content.github} />
                        </ListItemLink>
                        <ListItemLink href={content.linkedin}>
                            <ListItemIcon><LinkedInIcon /></ListItemIcon>
                            <ListItemText primary={content.linkedin} />
                        </ListItemLink>
                        <ListItemLink href="https://www.google.com/maps/place/Melbourne+VIC">
                            <ListItemIcon><MyLocationIcon /></ListItemIcon>
                            <ListItemText primary={content.location} />
                        </ListItemLink>
                    </List>
                </Grid>
                <Grid item md={4}>
                    <Typography variant="h3" gutterBottom>Work</Typography>
                    <Grid container spacing={4}>{content.work.map((data: any) => <Grid xs={12} item><ExperienceCard data={data} /></Grid>)}</Grid>
                </Grid>
                <Grid item md={4}>
                    <Typography variant="h3" gutterBottom>Education</Typography>
                    <Grid container spacing={4}>{content.education.map((data: any) => <Grid xs={12} item><ExperienceCard data={data} /></Grid>)}</Grid>
                </Grid>
                <Grid item md={4}>
                    <Typography variant="h3" gutterBottom>Programming Languages</Typography>
                    {content.technical.languages.map((data: string) => <Chip color='secondary' className={classes.chip} key={data} label={data} />)}
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
type Experience = { start: string, end: string, title: string, domains: Array<string>, organization: string, location: string }
function ExperienceCard(props: any) {
    const e: Experience = props.data
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle2" gutterBottom>{e.start} - {e.end}</Typography>
                <Typography variant="h5" component="h1">{e.title}</Typography>
                <Typography variant="subtitle1" component="p">{e.domains.join(", ")}</Typography>
                <Typography variant="body2" component="p">{e.organization}</Typography>
                <Typography variant="body2" component="p">{e.location}</Typography>
            </CardContent>
        </Card>
    )
}

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
    return <ListItem button component="a" {...props} />;
}

export default Home;
