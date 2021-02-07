import React, { Fragment } from "react";
import Container from '@material-ui/core/Container';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { Grid, CssBaseline, Box, ThemeProvider, List } from "@material-ui/core";
import { Profile, About } from '../common/Components';
import Blog, { BlogNav } from "../blog/Blog";
import Resume, { ResumeNav } from "../resume/Resume";

const theme = createMuiTheme({
    overrides: {
        //@ts-ignore types dont exist for some reason, see source on github
        MuiTimelineContent: {
            root: {
                paddingLeft: 0
            }
        },
        MuiTimeline: {
            root: {
                paddingLeft: 0
            }
        },
    },
    typography: {
        body1: {
            fontSize: 14
        },
        body2: {
            fontSize: 12
        },
    }
})

const useStyles = makeStyles({
    home: {
        marginTop: theme.spacing(4),
    },
    nav: {
        margin: '16px',
    },
    content: {
        padding: '8px',
        margin: '8px',
    },
})

function Home(props: any) {
    const { section } = props
    const classes = useStyles();

    props = { ...props, classes }

    return <Fragment>
        <ThemeProvider theme={theme} >
            <CssBaseline />
            <Container className={classes.home}>
                <Grid container direction="row">
                    {/* Sidebar */}
                    <Grid item container direction="column" xs={12} md={2}>
                        <Profile {...props} />
                        <Nav {...props} />
                    </Grid>
                    {/* Main Content */}
                    <Grid item xs={12} md={10}>
                        <Box className={classes.content}>
                            {!section && <About {...props} />}
                            {section === "resume" && <Resume {...props} />}
                            {section === "blog" && <Blog {...props} />}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    </Fragment >
}

function Nav(props: any) {
    const { classes } = props
    return classes
        ?
        <React.Fragment>
            <Box className={classes.nav}>
                <List>
                    <ResumeNav {...props} />
                    <BlogNav {...props} />
                </List>
            </Box>
        </React.Fragment>
        :
        <React.Fragment />
}




export default Home
