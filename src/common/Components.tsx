import React from "react";
import { makeStyles } from "@material-ui/core/styles"
import { Avatar, Box, ListItem, ListItemIcon, ListItemText, List, Grid, Link, Typography } from "@material-ui/core"
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import WebIcon from '@material-ui/icons/Web';
import PhoneIcon from '@material-ui/icons/Phone';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import { Twitter } from "@material-ui/icons";
import { textBlock } from "./Util";
import { Link as RouterLink } from "@reach/router";
import avatar from 'resources/about/avatar.jpg';
import about from 'resources/about/about.json'
import contact from 'resources/about/contact.json'

const useStyles = makeStyles((theme: any) => ({
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
    }
}));

export function ExternalLink(props: any) {
    return <Link {...props} component="a" color="inherit">{props.children}</Link>
}
export function LocalLink(props: any) {
    return <Link {...props} component="div" color="inherit">
        <RouterLink to={props.href} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            {props.children}
        </RouterLink>
    </Link>
}

export function Profile(props: any) {
    const classes = useStyles()
    return contact && avatar
        ? <React.Fragment>
            <Grid container justify="center" alignItems="center">
                <Box className={classes.avatar}>
                    <Avatar src={avatar} />
                </Box>
            </Grid>
            <Grid container justify="center" alignItems="center">
                <Box className={classes.name}>
                    <LocalLink href="/" variant="h6">{contact.name}</LocalLink>
                </Box>
            </Grid>
            <Social {...props} />
        </React.Fragment>
        :
        <React.Fragment />
}

export function Social(props: any) {
    const classes = useStyles()
    return contact
        ?
        <Box className={classes.social}>
            <Grid container justify="center" alignItems="center" spacing={2}>
                <Grid item><ExternalLink href={contact.github}><GitHubIcon /></ExternalLink></Grid>
                <Grid item><ExternalLink href={contact.linkedin}><LinkedInIcon /></ExternalLink></Grid>
                <Grid item><ExternalLink href={contact.twitter}><Twitter /></ExternalLink></Grid>
            </Grid >
        </Box >
        :
        <React.Fragment />
}

export function About(props: any) {
    return about && contact
        ?
        <Box>
            <Typography variant="h6" gutterBottom>About Me</Typography>
            <hr />
            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>{textBlock(about)}</Typography>
        </Box>
        :
        <React.Fragment />
}


export function ContactItem(props: any) {
    return (
        <ListItem button component="a" href={props.link}>
            <ListItemIcon><props.icon fontSize="small" /></ListItemIcon>
            <ListItemText primary={props.text} />
        </ListItem>
    )
}

// Section with all the contact info
// Photo, phone, email etc.
export function Contact(props: any) {
    let contact = props.contact
    return contact
        ?
        <Box className={props.classes.contact}>
            {contact.avatar && (props.avatar ?? true) && <Avatar src={contact.avatar} />}
            <List dense>
                <ContactItem icon={PhoneIcon} text={contact.phone} link={`tel:${contact.phone}`} />
                <ContactItem icon={WebIcon} text={contact.website} link={contact.website} />
                <ContactItem icon={GitHubIcon} text={(props.renderLinks ?? true) ? contact.github : "GitHub"} link={contact.github} />
                <ContactItem icon={LinkedInIcon} text={(props.renderLinks ?? true) ? contact.linkedin : "LinkedIn"} link={contact.linkedin} />
                <ContactItem icon={MyLocationIcon} text={[contact.location.city, contact.location.country].join(", ")} link={contact.maps} />
            </List>
        </Box>
        :
        <React.Fragment />
}
