import React from "react";
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div>
                <h1 id="gavin-rossiter">Gavin Rossiter</h1>
                <table >
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="link-icon"><span role="img" aria-label="web">🌐</span></td>
                            <td><strong>Website:</strong></td>
                            <td><a href="https://gavinrossiter.dev">gavinrossiter.dev</a></td>
                        </tr>
                        <tr>
                            <td className="link-icon"><img src="GitHub-Mark-Light-32px.png" height="16pt" alt="github" /></td>
                            <td><strong>Github:</strong></td>
                            <td><a href="https://github.com/krooq">github.com/krooq</a></td>
                        </tr>
                        <tr>
                            <td className="link-icon"><img src="LI-In-Bug.png" height="16pt" alt="linkedin" /></td>
                            <td><strong>LinkedIn:</strong></td>
                            <td><a href="https://www.linkedin.com/in/gavin-rossiter">linkedin.com/in/gavin-rossiter</a></td>
                        </tr>
                        <tr>
                            <td className="link-icon"><span role="img" aria-label="location">📍</span></td>
                            <td><strong>Location:</strong></td>
                            <td>Melbourne, Australia</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h2 id="motivation"><span className="emoji" role="img" aria-label="motivation">✨</span>Motivation</h2>
                <ul>
                    <li>I like to spend my spare time working on human-machine interface and AI projects.</li>
                    <li>It is my goal to help humanity build a safe and symbiotic relationship with a future artificial general
        intelligence.</li>
                    <li>So that ultimately humanity can enjoy the freedoms of a post scarcity economy awarded by such technologies.</li>
                    <li>I also like to keep the lights on, so at my day job I help make the skies safer by building the next generation
        of air traffic management systems.</li>
                </ul>
            </div>
            <div>
                <h2 id="education"><span className="emoji" role="img" aria-label="education">🎓</span>Education</h2>
                <h4 id="bachelor-of-computer-science">Bachelor of Computer Science</h4>
                <ul>
                    <li>Swinburne University</li>
                    <li>Software Development Major</li>
                    <li>2015 – 2017</li>
                </ul>
                <h4 id="bachelor-of-science">Bachelor of Science</h4>
                <ul>
                    <li>La Trobe University</li>
                    <li>Mathematics Major</li>
                    <li>2012 – 2015</li>
                </ul>
            </div>
            <div id="work">
                <h2 id="work"><span className="emoji" role="img" aria-label="work">💼</span>Work</h2>
                <h4 id="software-engineer">Software Engineer</h4>
                <ul>
                    <li>Thales</li>
                    <li>Airspace Mobility Solutions</li>
                    <li>Melbourne, Australia</li>
                    <li>2018 - Present</li>
                </ul>
                <h4 id="software-engineer-intern">Software Engineer Intern</h4>
                <ul>
                    <li>Thales</li>
                    <li>Airspace Mobility Solutions Innovation Lab</li>
                    <li>Melbourne, Australia</li>
                    <li>2016 - 2017 </li>
                </ul>
            </div>
            <div >
                <h2 id="languages"><span className="emoji" role="img" aria-label="languages">🖥️</span>Languages</h2>
                <p>Java, Python, Rust, Dart, Bash, JavaScript, TypeScript, HTML, CSS</p>
            </div>
            <div >
                <h2 id="projects"><span className="emoji" role="img" aria-label="projects">🚧</span>Projects</h2>
                <p><a href="/app">Layout App - WIP</a></p>
            </div>
            <hr />
            <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/gavin-rossiter">Gavin Rossiter</a>
            </p>
        </div>
    )
}
export default Home;
