import React, { useState } from "react";
import './Home.css';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, ThemeProvider } from "@material-ui/core";
import "fontsource-bungee"
import landingImage from './images/nasa.jpg';
import resumeData from './data/resume.json';

function Home() {
    const content = {
        prelude: "I'm working\nto solve todays\nbiggest problem",
        title: "Human\nAI\nsymbiosis",
    }
    const theme = createMuiTheme();
    theme.typography.h1 = {
        fontSize: '2.5rem',
        lineHeight: '2.5rem',
        '@media (min-width:800px)': {
            fontSize: '4rem',
            lineHeight: '4rem'
        },
        fontFamily: "Bungee"
    };
    const useStyles = makeStyles((theme) => ({
        landing: {
            background: 'url(./images/nasa.jpg) #00000050 no-repeat center center',
            backgroundBlendMode: 'darken',
            backgroundSize: 'cover',
            height: '100vh',
            padding: '0',
            maxWidth: '100%',
            minHeight: '100%'
        },
        title: {
            color: 'white',
            // fontWeight: 'bold',
            padding: '16px',
            // height: '100%'
            // width: '100%'
        },
        landingContent: {
            height: '100%'
        }
    }))
    const classes = useStyles();
    // const [theme, setTheme] = useState("🌑");

    // let homeClass = "home";
    // homeClass += (theme === "🌕" ? " light" : " dark")
    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Container className={classes.landing}>
                    <Grid container justify="center" alignItems="center" className={classes.landingContent}>
                        <Grid item className={classes.title}>
                            <Typography variant="h1" style={{ color: '#ff8359', whiteSpace: 'pre-wrap' }}>{content.prelude}</Typography>
                            <Typography variant="h1" style={{ whiteSpace: 'pre-wrap' }}>{content.title}</Typography>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Resume />
                </Container>
            </ThemeProvider>
        </React.Fragment >
        // <div className={homeClass}>
        //     <div className="content">
        //         <div>
        //             <button className="theme-selector" onClick={() => setTheme(theme === "🌑" ? "🌕" : "🌑")}><span role="img" aria-label="theme">{theme}</span></button>
        //             <h1 id="gavin-rossiter">Gavin Rossiter</h1>
        //             <table >
        //                 <thead>
        //                     <tr>
        //                         <th></th>
        //                         <th></th>
        //                         <th></th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     <tr>
        //                         <td className="link-icon"><span role="img" aria-label="web">🌐</span></td>
        //                         <td><strong>Website:</strong></td>
        //                         <td><a href="https://gavinrossiter.dev">gavinrossiter.dev</a></td>
        //                     </tr>
        //                     <tr>
        //                         <td className="link-icon"><img src="GitHub-Mark-Light-32px.png" height="16pt" alt="github" /></td>
        //                         <td><strong>Github:</strong></td>
        //                         <td><a href="https://github.com/krooq">github.com/krooq</a></td>
        //                     </tr>
        //                     <tr>
        //                         <td className="link-icon"><img src="LI-In-Bug.png" height="16pt" alt="linkedin" /></td>
        //                         <td><strong>LinkedIn:</strong></td>
        //                         <td><a href="https://www.linkedin.com/in/gavin-rossiter">linkedin.com/in/gavin-rossiter</a></td>
        //                     </tr>
        //                     <tr>
        //                         <td className="link-icon"><span role="img" aria-label="location">📍</span></td>
        //                         <td><strong>Location:</strong></td>
        //                         <td>Melbourne, Australia</td>
        //                     </tr>
        //                 </tbody>
        //             </table>
        //         </div>
        //         <div>
        //             <h2 id="motivation"><span className="emoji" role="img" aria-label="motivation">✨</span>Motivation</h2>
        //             <ul>
        //                 <li>I like to spend my spare time working on human-machine interface and AI projects.</li>
        //                 <li>It is my goal to help humanity build a safe and symbiotic relationship with a future artificial general
        // intelligence.</li>
        //                 <li>So that ultimately humanity can enjoy the freedoms of a post scarcity economy awarded by such technologies.</li>
        //                 <li>I also like to keep the lights on, so at my day job I help make the skies safer by building the next generation
        // of air traffic management systems.</li>
        //             </ul>
        //         </div>
        //         <div >
        //             <h2 id="education"><span className="emoji" role="img" aria-label="education">🎓</span>Education</h2>
        //             <h4 id="bachelor-of-computer-science">Bachelor of Computer Science</h4>
        //             <ul>
        //                 <li>Swinburne University</li>
        //                 <li>Software Development Major</li>
        //                 <li>2015 – 2017</li>
        //             </ul>
        //             <h4 id="bachelor-of-science">Bachelor of Science</h4>
        //             <ul>
        //                 <li>La Trobe University</li>
        //                 <li>Mathematics Major</li>
        //                 <li>2012 – 2015</li>
        //             </ul>
        //         </div>
        //         <div >
        //             <h2 id="work"><span className="emoji" role="img" aria-label="work">💼</span>Work</h2>
        //             <h4 id="software-engineer">Software Engineer</h4>
        //             <ul>
        //                 <li>Thales</li>
        //                 <li>Airspace Mobility Solutions</li>
        //                 <li>Melbourne, Australia</li>
        //                 <li>2018 - Present</li>
        //             </ul>
        //             <h4 id="software-engineer-intern">Software Engineer Intern</h4>
        //             <ul>
        //                 <li>Thales</li>
        //                 <li>Airspace Mobility Solutions Innovation Lab</li>
        //                 <li>Melbourne, Australia</li>
        //                 <li>2016 - 2017 </li>
        //             </ul>
        //         </div>
        //         <div >
        //             <h2 id="languages"><span className="emoji" role="img" aria-label="languages">🖥️</span>Languages</h2>
        //             <p>Java, Python, Rust, Dart, Bash, JavaScript, TypeScript, HTML, CSS</p>
        //         </div>
        //         <div >
        //             <h2 id="projects"><span className="emoji" role="img" aria-label="projects">🚧</span>Projects</h2>
        //             <p><a href="/app">Layout App - WIP</a></p>
        //         </div>
        //     </div>
        //     <footer>
        //         <hr />
        //         <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/gavin-rossiter">Gavin Rossiter</a>
        //         </p>
        //     </footer>
        // </div>
    )
}
function Resume() {
    const content = resumeData;
    return (<React.Fragment>
        <Grid container justify="center" alignItems="center">
            <Grid item>
                <Typography variant="h2">{content.name}</Typography>
            </Grid>
        </Grid>
    </React.Fragment>)
}

export default Home;
