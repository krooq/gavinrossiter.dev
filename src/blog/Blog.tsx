import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Main from './Main';
import { useEffect } from 'react';

const useStyles = makeStyles((theme: any) => ({
  mainGrid: {
  },
}));

export default function Blog(props: any) {
  const classes = useStyles();
  const [postMarkdown, setPostMarkdown] = React.useState('');

  // useEffect with an empty dependency array (`[]`) runs only once
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/blog/game_devlog_1.md").then((response) => response.text()).then((text) => setPostMarkdown(text));
  }, []);

  return (
    <React.Fragment>
      <Grid container className={classes.mainGrid}>
        <Main title="Posts" posts={[postMarkdown]} />
      </Grid>
    </React.Fragment >
  );
}
