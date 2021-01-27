import React, { Fragment } from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CssBaseline, Box, Link, Divider } from "@material-ui/core";
import resumeData from '../data/resume.json';
import { Contact } from '../common/Components';
import { textBlock } from '../common/Util';

const useStyles = makeStyles((theme) => ({
    nav: {
        padding: '8px',
        margin: '16px',
    },
    contact: {
        padding: '8px',
        margin: '16px',
        '& .MuiAvatar-root': {
            height: theme.spacing(20),
            width: theme.spacing(20),
            margin: "auto"
        },
        '& .MuiListItemIcon-root': {
            minWidth: '0',
            paddingRight: '16px'
        }
    },
    cv: {}
}))

function Home() {
    const classes = useStyles();
    const data = resumeData
    const renderLinks = false
    const props = { classes, data, renderLinks }
    return (
        <Fragment>
            {/* <ThemeProvider theme={theme} > */}
            <CssBaseline />
            <Container>
                {/* ROW 1 */}
                <Nav {...props} />
                {/* ROW 2 */}
                <Grid container direction="row">
                    <Grid item xs={12} md={3}>
                        <Contact {...props} />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Box className={props.classes.contact}>
                            <About {...props} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Fragment >
    )
}



function NavLink(props: any) {
    return (
        <Box className={props.classes.nav}>
            <Link {...props} variant="h6" component="a" color="inherit">{props.name}</Link>
        </Box>);
}


function Nav(props: any) {
    const data = props.data
    return <React.Fragment>
        <Grid container direction="row">
            <Grid item md={3}><NavLink classes={props.classes} href="/" name={data.name} /></Grid>
            <Grid item>
                <Grid container direction="row">
                    <Grid item><NavLink classes={props.classes} href="/cv" name="Resume" /></Grid>
                    <Grid item><NavLink classes={props.classes} href="/blog" name="Blog" /></Grid>
                    <Grid item><NavLink classes={props.classes} href="/app" name="React Demo" /></Grid>
                </Grid>
            </Grid>
        </Grid>
        <Divider />
    </React.Fragment>
}

function About(props: any) {
    const data = props.data
    return <Box className={props.classes.cv}>
        <Container>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(data.about)}</Typography>
        </Container>
    </Box>
}


export default Home
