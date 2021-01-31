import React, { Fragment, useEffect } from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CssBaseline, Box, Link, Divider, Avatar, createMuiTheme, ThemeProvider, List, ListItem } from "@material-ui/core";
import { LinkItem, Profile } from '../common/Components';
import { textBlock } from '../common/Util';
import Blog from "../blog/Blog";


const theme = createMuiTheme({

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

function Home() {
    const classes = useStyles();
    const [contact, setContact] = React.useState<any>();
    const [about, setAbout] = React.useState<any>();

    const renderLinks = false
    const props = { classes, about, contact, renderLinks }

    // useEffect with an empty dependency array (`[]`) runs only once
    useEffect(() => {
        fetch("about/about.json").then((response) => response.json()).then((json) => setAbout(json));
        fetch("about/contact.json").then((response) => response.json()).then((json) => setContact(json));
    }, []);

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
                                <About {...props} />
                                <Blog {...props} />
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
                    <ListItem><LinkItem variant="body1" href="/resume">Resume</LinkItem></ListItem>
                    <ListItem><LinkItem variant="body1" href="/app">React Demo</LinkItem></ListItem>
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
                <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(about)}</Typography>
            </Container>
        </Box>
        :
        <React.Fragment />
}


export default Home
