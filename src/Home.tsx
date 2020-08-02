import React from "react";
import './Home.css';

function Home() {
    return (
        <div className="home">
            <h1 id="gavin-rossiter">Gavin Rossiter</h1>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Website:</strong></td>
                        <td><a href="https://gavinrossiter.dev">gavinrossiter.dev</a></td>
                    </tr>
                    <tr>
                        <td><strong>Github:</strong></td>
                        <td><a href="https://github.com/krooq">github.com/krooq</a></td>
                    </tr>
                    <tr>
                        <td><strong>LinkedIn:</strong></td>
                        <td><a href="https://www.linkedin.com/in/gavin-rossiter">linkedin.com/in/gavin-rossiter</a></td>
                    </tr>
                    <tr>
                        <td><strong>Location:</strong></td>
                        <td>Melbourne Region, Victoria, Australia</td>
                    </tr>
                </tbody>
            </table>
            <h3 id="motivation">Motivation</h3>
            <ul>
                <li>Right now, I spend my spare time working on improving the interface between human and machine</li>
                <li>It is my goal to help humanity build a safe and symbiotic relationship with a future artificial general
        intelligence</li>
                <li>So that ultimately humanity can enjoy the freedoms of a post scarcity economy awarded by such technologies</li>
                <li>I also like to keep the lights on, so at my day job I help make the skies safer by building the next generation
        of air traffic management systems</li>
            </ul>
            <h2 id="education">Education</h2>
            <h4 id="bachelor-of-computer-science">Bachelor of Computer Science</h4>
            <ul>
                <li>Swinburne University</li>
                <li>Software Development Major</li>
                <li>2015 – 2017</li>
                <li><a href="https://www.swinburneonline.edu.au/future-students/graduation-beyond/grade-point-average">GPA 2.857</a>
                </li>
            </ul>
            <h4 id="bachelor-of-science">Bachelor of Science</h4>
            <ul>
                <li>La Trobe University</li>
                <li>Mathematics Major</li>
                <li>2012 – 2015</li>
                <li><a href="https://www.latrobe.edu.au/mylatrobe/calculating-your-weighted-average-mark-wam/">WAM 81.95</a></li>
            </ul>
            <h2 id="technical-experience">Technical Experience</h2>
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
            <h2 id="languages">Languages</h2>
            <p>Java, Python, Rust, Dart, Bash, JavaScript, TypeScript, HTML, CSS</p>
            <h2 id="projects">Projects</h2>
            <p><a href="/app">layout app</a></p>
            <div />

            <hr />
            <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/gavin-rossiter">linkedin.com/in/gavin-rossiter</a>
            </p>
        </div>
    )
}
export default Home;
