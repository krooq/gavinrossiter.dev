import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Main from './Main';
import { useEffect } from 'react';
import { Collapse, List, ListItem, ListItemText } from '@material-ui/core';
import { LocalLink } from 'common/Components';
import { ExpandLess, ExpandMore } from '@material-ui/icons';


const posts = new Map([
  ["game_devlog_3", "Game Devlog 3"],
  ["game_devlog_2", "Game Devlog 2"],
  ["game_devlog_1", "Game Devlog 1"],
  ["xml_vs_json", "XML vs JSON"]
])


const useStyles = makeStyles((theme: any) => ({
  mainGrid: {},
}));

export default function Blog(props: any) {
  const { post } = props
  const classes = useStyles();
  const [postMarkdown, setPostMarkdown] = React.useState('');

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/blog/${post}.md`).then((response) => response.text()).then((text) => setPostMarkdown(text));
  }, [post]);

  return (
    <React.Fragment>
      {/* <Grid container className={classes.mainGrid}>
        <Main title="Posts" posts={[postMarkdown]} />
      </Grid> */}
    </React.Fragment >
  );
}

export function BlogNav(props: any) {
  const { section } = props
  const [open, setOpen] = React.useState(section === "blog");
  const toggleOpen = () => { setOpen(!open); };

  return <React.Fragment key="Blogf">
    <ListItem button onClick={toggleOpen} key="Blog"><ListItemText primary="Blog" />{open ? <ExpandLess /> : <ExpandMore />}</ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" dense disablePadding>
        {[...posts].flatMap(([url, title]) => <ListItem key={url}><LocalLink href={`/blog/${url}`}><ListItemText primary={title} /></LocalLink></ListItem>)}
      </List>
    </Collapse>
  </React.Fragment >
}