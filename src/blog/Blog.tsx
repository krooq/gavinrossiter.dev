import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
// import GitHubIcon from '@material-ui/icons/GitHub';
// import FacebookIcon from '@material-ui/icons/Facebook';
// import TwitterIcon from '@material-ui/icons/Twitter';
import Header from './Header';
import Main from './Main';
// import Sidebar from './Sidebar';
import { useEffect } from 'react';
// import post2 from './blog-post.2.md';
// import post3 from './blog-post.3.md';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

// const posts: any[] = [
//   post2, post3
// ];

// const sidebar = {
//   title: 'About',
//   description:
//     'Work in progress :)',
//   archives: [
//     { title: 'March 2020', url: '#' },
//     { title: 'February 2020', url: '#' },
//     { title: 'January 2020', url: '#' },
//     { title: 'November 1999', url: '#' },
//     { title: 'October 1999', url: '#' },
//     { title: 'September 1999', url: '#' },
//     { title: 'August 1999', url: '#' },
//     { title: 'July 1999', url: '#' },
//     { title: 'June 1999', url: '#' },
//     { title: 'May 1999', url: '#' },
//     { title: 'April 1999', url: '#' },
//   ],
//   social: [
//     { name: 'GitHub', icon: GitHubIcon },
//     { name: 'Twitter', icon: TwitterIcon },
//     { name: 'Facebook', icon: FacebookIcon },
//   ],
// };

export default function Blog(props: any) {
  const classes = useStyles();
  const [postMarkdown, setPostMarkdown] = React.useState('');

  // useEffect with an empty dependency array (`[]`) runs only once
  useEffect(() => {
    fetch("blog/game_devlog_1.md").then((response) => response.text()).then((text) => setPostMarkdown(text));
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container >
        {/* <Header title="Gav's Dev Blog" /> */}
        <Grid container className={classes.mainGrid}>
          <Main title="Posts" posts={[postMarkdown]} />
          {/* <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            /> */}
        </Grid>
      </Container>
      {/* <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      /> */}
    </React.Fragment >
  );
}
