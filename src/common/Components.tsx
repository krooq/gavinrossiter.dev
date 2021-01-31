import React from "react";
import { Avatar, Box, ListItem, ListItemIcon, ListItemText, List, Grid, Icon, Button, IconButton, Link, Typography } from "@material-ui/core"
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import WebIcon from '@material-ui/icons/Web';
import PhoneIcon from '@material-ui/icons/Phone';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import { Twitter } from "@material-ui/icons";

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


export function LinkItem(props: any) {
    return <Link {...props} component="a" color="inherit">{props.children}</Link>
}

export function Profile(props: any) {
    let { contact, classes } = props
    return <React.Fragment>
        <Grid container justify="center" alignItems="center">
            <Box className={classes.avatar}>
                <Avatar src={contact.avatar} />
            </Box>
        </Grid>
        <Grid container justify="center" alignItems="center">
            <Box className={classes.name}>
                <LinkItem href="/" variant="h6">{contact.name}</LinkItem>
            </Box>
        </Grid>
        <Social {...props} />
    </React.Fragment>
}

export function Social(props: any) {
    let { contact, classes } = props
    return contact
        ?
        <Box className={classes.social}>
            <Grid container justify="center" alignItems="center" spacing={2}>
                <Grid item><LinkItem href={contact.github}><GitHubIcon /></LinkItem></Grid>
                <Grid item><LinkItem href={contact.linkedin}><LinkedInIcon /></LinkItem></Grid>
                <Grid item><LinkItem href={contact.twitter}><Twitter /></LinkItem></Grid>
            </Grid >
        </Box >
        :
        <React.Fragment />
}