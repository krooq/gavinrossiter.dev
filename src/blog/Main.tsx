import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Markdown from './Markdown';
import ReactPlayer from "react-player"

const useStyles = makeStyles((theme) => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
  },
}));

interface MainProps {
  posts: Array<string>;
  title: string;
}

export default function Main(props: MainProps) {
  const classes = useStyles();
  const { posts } = props;

  return (
    <Grid container justify="center">
      <Grid item xs={12} md={8}  >
        {posts.map((post) => (
          <React.Fragment>
            <Markdown className={classes.markdown} key={post.substring(0, 40)} options={{
              overrides: {
                ReactPlayer: {
                  component: ReactPlayer,
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
