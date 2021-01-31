import React, { Fragment } from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CssBaseline, Box, createMuiTheme, ThemeProvider, List, ListItem, ListItemText } from "@material-ui/core";
import { LinkItem, Profile } from '../common/Components';
import { textBlock } from '../common/Util';
import Blog from "../blog/Blog";
import Resume from "../resume/Resume";
import avatar from 'resources/about/avatar.jpg';
import about from 'resources/about/about.json'
import contact from 'resources/about/contact.json'
import experience from 'resources/about/experience.json'
import education from 'resources/about/education.json'
import projects from 'resources/about/projects.json'
import skills from 'resources/about/skills.json'

const theme = createMuiTheme({
    typography: {
        fontSize: 12,
    }
})

const useStyles = makeStyles((theme) => ({
    home: {
        marginTop: '32px',
    },
    nav: {
        margin: '16px',
    },
    about: {},
    name: {
        padding: '4px',
        margin: '4px'
    },
    avatar: {
        padding: '8px',
        margin: '8px',
        '& .MuiAvatar-root': {
            height: theme.spacing(16),
            width: theme.spacing(16),
            margin: "auto"
        }
    },
    social: {
        padding: '4px',
        margin: '4px',
    },
    content: {
        padding: '8px',
        margin: '8px',
    },
}))

function Home(props: any) {
    const section = props.section
    const classes = useStyles();
    const renderLinks = false

    props = {
        ...props, classes, about, contact: { ...contact, avatar: avatar }, experience, education, projects, skills, renderLinks
    }

    return about && contact
        ?
        <Fragment>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Container className={classes.home}>
                    <Grid container direction="row">
                        {/* Sidebar */}
                        <Grid container direction="column" xs={12} md={2}>
                            <Profile {...props} />
                            <Nav {...props} />
                        </Grid>
                        {/* Main Content */}
                        <Grid item xs={12} md={10}>
                            <Box className={classes.content}>
                                {section !== "blog" && <About {...props} />}
                                {section === "resume" && <Resume {...props} />}
                                {section === "blog" && <Blog {...props} />}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        </Fragment >
        :
        <Fragment />
}

function Nav(props: any) {
    const { classes } = props
    return classes
        ?
        <React.Fragment>
            <Box className={classes.nav}>
                <List>
                    <ListItem ><LinkItem href="/resume"><ListItemText primary="Resume" /></LinkItem></ListItem>
                    <ListItem><LinkItem href="/blog"><ListItemText primary="Blog" /></LinkItem></ListItem>
                </List>
            </Box>
        </React.Fragment>
        :
        <React.Fragment />
}

type AboutProps = {
    about: any
    contact: any
    classes: { about: any }
}
function About(props: AboutProps) {
    const { about, contact, classes } = props
    return about && contact && classes
        ?
        <Box className={classes.about}>
            <Container>
                <Typography variant="h6" gutterBottom>About Me</Typography>
                <hr />
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(about)}</Typography>
            </Container>
        </Box>
        :
        <React.Fragment />
}


export default Home
