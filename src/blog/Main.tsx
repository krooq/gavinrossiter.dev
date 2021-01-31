import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Markdown from './Markdown';
import ReactPlayer from "react-player"
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  markdown: {
    // ...theme.typography.body2,
    // padding: theme.spacing(3, 0),
  },
}));

interface MainProps {
  posts: Array<string>;
  title: string;
}

export function Video(props: any) {
  return <Grid item container justify="center" alignItems="center">
    <ReactPlayer controls muted url={props.url} />
  </Grid >
}

export default function Main(props: MainProps) {
  const classes = useStyles();
  const { posts } = props;

  return (
    <Grid container justify="center">
      <Grid item >
        {posts.map((post) => (
          <React.Fragment>
            <Markdown className={classes.markdown} key={post.substring(0, 40)} options={{
              overrides: {
                Video: {
                  component: Video,
                },
              },
            }}>
              {post}
            </Markdown>
          </React.Fragment>
        ))}
      </Grid>
    </Grid>
  );
}
