import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Box, List, ListItem, ListItemText } from "@material-ui/core";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import "../index.css";
import { About, ExternalLink, LocalLink } from "common/Components";
import about from "resources/about/about.json";
import contact from "resources/about/contact.json";
import employment from "resources/about/employment.json";
import education from "resources/about/education.json";
import projects from "resources/about/projects.json";
import skills from "resources/about/skills.json";
import DownloadResumeAsWordButton from "./ResumeDocx";

const useStyles = makeStyles({
  print: {
    "@media print": {
      display: "block",
      pageBreakBefore: "always",
    },
  },
});

function Resume(props: any) {
  const classes = useStyles();
  const aboutProps = { about, contact, classes };
  return contact && employment && education && projects && skills ? (
    <React.Fragment>
      <About {...aboutProps} />
      <br />
      <Skills {...props} />
      <br />
      <ExperienceTimeline {...props} title="Employment" data={employment} />
      <ExperienceTimeline {...props} title="Education" data={education} />
      <ExperienceTimeline {...props} title="Projects" data={projects} />
    </React.Fragment>
  ) : (
    <React.Fragment />
  );
}

type ExperienceData = {
  start: string;
  end: string;
  title: string;
  domains: Array<string>;
  organization: string;
  location: string;
  description: string;
  link: string;
  notes: string[];
};

function Skills(props: any) {
  const classes = props.classes;
  return (
    <React.Fragment>
      <Typography className={classes.print} variant="h6" gutterBottom>
        Skills
      </Typography>
      <hr />
      <Box>
        <Typography variant="body1" style={{ fontWeight: "bold" }}>
          Programming Languages
        </Typography>
        <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
          Expert: {skills.languages.expert.join(", ")}
        </Typography>
        <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
          Productive: {skills.languages.productive.join(", ")}
        </Typography>
        <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
          Familiar: {skills.languages.familiar.join(", ")}
        </Typography>
        <br />
        <Typography variant="body1" gutterBottom style={{ fontWeight: "bold" }}>
          Tools
        </Typography>
        <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
          {skills.tools.join(", ")}
        </Typography>
        <br />
        <Typography variant="body1" gutterBottom style={{ fontWeight: "bold" }}>
          Frameworks
        </Typography>
        <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
          {skills.frameworks.join(", ")}
        </Typography>
        <br />
      </Box>
    </React.Fragment>
  );
}

function ExperienceTimeline(props: any) {
  const title: string = props.title;
  const data: Array<ExperienceData> = props.data;
  return (
    <React.Fragment>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      <hr />
      <Timeline>
        {data.map((d: any) => (
          <ExperienceTimelineItem key={d?.title + d?.start + d?.end} data={d} />
        ))}
      </Timeline>
    </React.Fragment>
  );
}

function ExperienceTimelineItem(props: any) {
  const data: ExperienceData = props.data;
  return (
    <TimelineItem>
      <TimelineContent style={{ flexGrow: 1 }}>
        {data?.title && (
          <Typography
            variant="body1"
            component="h1"
            align="left"
            style={{ fontWeight: "bold" }}
          >
            {data.title}
          </Typography>
        )}
        {data?.organization && (
          <Typography variant="body2" component="p" align="left">
            {data.organization}
          </Typography>
        )}
        {data?.description && (
          <Typography variant="body2" component="p" align="left">
            {data.description}
          </Typography>
        )}
        {data?.domains && data.domains.length > 0 && (
          <Typography variant="body2" component="p" align="left">
            {data.domains.join(", ")}
          </Typography>
        )}
        {data?.link && (
          <ExternalLink variant="body2" href={data.link}>
            {data.link}
          </ExternalLink>
        )}
        {data?.notes && (
          <List dense disablePadding>
            {data?.notes.map((n: any) => (
              <ListItem key={n}>
                <ListItemText primary={`- ${n}`} />
              </ListItem>
            ))}
          </List>
        )}
      </TimelineContent>
      <TimelineOppositeContent style={{ flex: "none", width: "8rem" }}>
        <Typography
          variant="subtitle2"
          align="right"
          style={{ fontWeight: "bold" }}
        >
          {data.start} - {data.end}
        </Typography>
      </TimelineOppositeContent>
    </TimelineItem>
  );
}

export function ResumeNav(props: any) {
  const { section } = props;
  return (
    <React.Fragment>
      <ListItem>
        <LocalLink href="/resume">
          <ListItemText primary="Resume" />
        </LocalLink>
      </ListItem>
      {section === "resume" && (
        <ListItem>
          <DownloadResumeAsWordButton
            {...props}
            filename="GavinRossiter-Resume.docx"
          />
        </ListItem>
      )}
    </React.Fragment>
  );
}

export default Resume;
