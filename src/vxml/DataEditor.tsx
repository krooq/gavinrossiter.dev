import React from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, ThemeProvider, CssBaseline, TextField, Paper, Fab } from "@material-ui/core";
import "fontsource-bungee";
import AddIcon from '@material-ui/icons/Add';

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
    return (
        <React.Fragment>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Editor classes={classes} />
            </ThemeProvider>
        </React.Fragment >
    )
}


function Editor(props: any) {
    const data = props.data;
    return (
        <Container>
            <Grid container>
                <ObjectData obj={data} />
            </Grid>
        </Container>
    )
}

function ObjectData(props: any): JSX.Element {
    const label = props.label || ""
    const obj = props.obj
    const elements: JSX.Element[] = []
    const depth = props.depth || 0

    if (Array.isArray(obj)) {
        const listElements = []
        if (obj.length > 0) { listElements.push(<Typography variant="overline">{label}</Typography>) }
        for (const i in obj) {
            listElements.push(<ObjectData obj={obj[i]} depth={depth + 1} />)
        }
        listElements.push(<Grid container justify="center"><Grid item>
            <Fab variant="extended" color="primary" aria-label="add"><AddIcon />{label}</Fab>
        </Grid></Grid>)
        elements.push(<Paper elevation={depth} style={{ padding: '16px' }}><Grid container spacing={1}>{listElements}</Grid></Paper>)

    }
    else if (typeof obj === 'string') {
        elements.push(<TextField label={label} value={obj} multiline fullWidth />)
    }
    else if (typeof obj === 'object') {
        const objElements = []
        objElements.push(<Typography variant="overline">{label}</Typography>)
        for (const k in obj) {
            if (!obj.hasOwnProperty(k))
                continue;
            objElements.push(<ObjectData obj={obj[k]} label={k} />)
        }
        elements.push(<Paper elevation={depth} style={{ padding: '16px' }}><Grid container spacing={1} >{objElements}</Grid></Paper>)
    }
    return <Grid xs={12} item>{elements}</Grid>
}

export default DataEditor;
