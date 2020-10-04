import React from "react";
import { Avatar, Box, ListItem, ListItemIcon, ListItemText, List } from "@material-ui/core"
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import WebIcon from '@material-ui/icons/Web';
import PhoneIcon from '@material-ui/icons/Phone';
import MyLocationIcon from '@material-ui/icons/MyLocation';

export function ContactItem(props: any) {
    return (
        <ListItem button component="a" href={props.link}> 
            <ListItemIcon><props.icon fontSize="small"/></ListItemIcon>
            <ListItemText primary={props.text} />
        </ListItem>
    )
}

// Section with all the contact info
// Photo, phone, email etc.
export function Contact(props: any) {
    let data = props.data
    return <Box className={props.classes.contact}>
        {props.data.avatar && (props.avatar ?? true) && <Avatar src={props.data.avatar}/>}
        <List dense>
            <ContactItem icon={PhoneIcon} text={data.phone} link={`tel:${data.phone}`} />
            <ContactItem icon={WebIcon} text={data.website} link={data.website} />
            <ContactItem icon={GitHubIcon} text={(props.renderLinks ?? true) ? data.github : "GitHub"} link={data.github} />
            <ContactItem icon={LinkedInIcon} text={(props.renderLinks ?? true) ? data.linkedin : "LinkedIn"} link={data.linkedin} />
            <ContactItem icon={MyLocationIcon} text={[data.location.city, data.location.country].join(", ")} link={data.maps}/>
        </List>
    </Box>
}