import * as React from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Box, Grid } from '@material-ui/core';
import ReactPlayer from 'react-player';

const useStyles = makeStyles((theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
  video: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function MarkdownListItem(props: any) {
  const classes = useStyles();
  return (
    <li className={classes.listItem}>
      <Typography component="span" {...props} />
    </li>
  );
}


export function Video(props: any) {
  const classes = useStyles();
  return <Box className={classes.video}>
    <Grid item container justify="center" alignItems="center" >
      <ReactPlayer controls muted url={props.url} />
    </Grid >
  </Box>
}

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4',
      },
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h6' },
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'subtitle1' },
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'caption',
        paragraph: true,
      },
    },
    p: {
      component: Typography,
      props: { paragraph: true, variant: "body1" },
    },
    a: { component: Link },
    li: {
      component: MarkdownListItem,
    },
    Video: {
      component: Video
    },
  },
};

export default function Markdown(props: any) {
  return <MarkdownToJsx options={options} {...props} />;
}
