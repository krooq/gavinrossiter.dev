import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useEffect } from 'react';
// import post2 from './blog-post.2.md';
// import post3 from './blog-post.3.md';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

type LinkItem = {
  title: string;
  url: string;
};

const sections: LinkItem[] = [
  // { title: 'Technology', url: '#' },
  // { title: 'Design', url: '#' },
  // { title: 'Culture', url: '#' },
  // { title: 'Business', url: '#' },
  // { title: 'Politics', url: '#' },
  // { title: 'Opinion', url: '#' },
  // { title: 'Science', url: '#' },
  // { title: 'Health', url: '#' },
  // { title: 'Style', url: '#' },
  // { title: 'Travel', url: '#' },
];

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageText: 'Image Text',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageText: 'Image Text',
  },
];

const posts: any[] = [
  // post2, post3
];

const sidebar = {
  title: 'About',
  description:
    'Work in progress :)',
  archives: [
    // { title: 'March 2020', url: '#' },
    // { title: 'February 2020', url: '#' },
    // { title: 'January 2020', url: '#' },
    // { title: 'November 1999', url: '#' },
    // { title: 'October 1999', url: '#' },
    // { title: 'September 1999', url: '#' },
    // { title: 'August 1999', url: '#' },
    // { title: 'July 1999', url: '#' },
    // { title: 'June 1999', url: '#' },
    // { title: 'May 1999', url: '#' },
    // { title: 'April 1999', url: '#' },
  ],
  social: [
    // { name: 'GitHub', icon: GitHubIcon },
    // { name: 'Twitter', icon: TwitterIcon },
    // { name: 'Facebook', icon: FacebookIcon },
  ],
};

export default function Blog() {
  const classes = useStyles();
  const [postMarkdown, setPostMarkdown] = React.useState('');

  // useEffect with an empty dependency array (`[]`) runs only once
  useEffect(() => {
    fetch("posts/xml_vs_json.md")
      .then((response) => response.text())
      .then((text) => {
        // Logs a string of Markdown content.
        // Now you could use e.g. <rexxars/react-markdown> to render it.
        // console.log(text);
        setPostMarkdown(text);
      });
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Gav's Dev Blog" sections={sections} />
        <main>
          {/* <MainFeaturedPost post={mainFeaturedPost} /> */}
          {/* <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid> */}
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="Posts" posts={[postMarkdown]} />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
      {/* <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      /> */}
    </React.Fragment>
  );
}
