import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Markdown from './Markdown';



interface MainProps {
  posts: Array<string>;
  title: string;
}



export default function Main(props: MainProps) {
  const { posts } = props;
  return (
    <Grid container justify="center">
      <Grid item >
        {posts.map((post) => (
          <Markdown key={post.substring(0, 40)}>
            {post}
          </Markdown>
        ))}
      </Grid>
    </Grid>
  );
}
