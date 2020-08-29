import React from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, ThemeProvider, List, ListItem, ListItemIcon, ListItemText, ListItemProps, Chip, Card, CardContent, CssBaseline } from "@material-ui/core";
import "fontsource-bungee";
import resumeData from './home/data/resume.json';
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


function DataEditor() {
    const classes = useStyles();
    const content = {
        prelude: "I'm working\nto solve todays\nbiggest problem",
        title: "Human\nAI\nsymbiosis",
    }
    return (
        <React.Fragment>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Editor classes={classes} data={resumeData} />
            </ThemeProvider>
        </React.Fragment >
    )
}


function Editor(props: any) {
    const classes = props.classes;
    const data = props.data;
    return (
        <Container>
            {/* <Grid container spacing={4}> */}
            <ObjectData obj={data} />
            {/* </Grid> */}
        </Container>
    )
}

function ObjectData(props: any): JSX.Element {
    const path = props.path || ""
    const obj = props.obj
    const elements: JSX.Element[] = []

    console.log(obj + " | " + (Array.isArray(obj) && "array") + " | " + typeof obj)
    if (Array.isArray(obj)) {
        for (const v of obj) {
            elements.push(<ObjectData obj={v} path={`${path}`} />)
        }
    }
    else if (typeof obj === 'string') {
        elements.push(
            <Card>
                <Typography variant="h6" component="h1">{`${path}`}</Typography>
                <Typography variant="body1">{`${obj}`}</Typography>
            </Card>
        )
    }
    else if (typeof obj === 'object') {
        for (const k in obj) {
            if (!obj.hasOwnProperty(k))
                continue;
            const attrPath = path.length != 0 ? `${path}.${k}` : k
            elements.push(<ObjectData obj={obj[k]} path={attrPath} />)
        }
    }
    return <React.Fragment>{elements}</React.Fragment>
}

export default DataEditor;
