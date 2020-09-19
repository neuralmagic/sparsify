import React from "react";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";

import { ReactComponent as Icon } from "./img/icon.svg";
import AbsoluteLayout from "../../components/absolute-layout";
import { selectSelectedProjectState } from "../../store";
import LoaderLayout from "../../components/loader-layout";
import NullableText from "../../components/nullable-text";
import makeStyles from "./project-styles";

const useStyles = makeStyles();

function Project() {
  const classes = useStyles();

  const selectedProjectState = useSelector(selectSelectedProjectState);
  const projectName = selectedProjectState.val ? selectedProjectState.val.name : null;
  const projectDesc = selectedProjectState.val
    ? selectedProjectState.val.description
    : null;

  return (
    <AbsoluteLayout spacingTop={4} spacingBottom={4} spacingRight={4} spacingLeft={4}>
      <LoaderLayout
        status={selectedProjectState.status}
        error={selectedProjectState.error}
        rootClass={classes.root}
      >
        <div className={classes.layout}>
          <div className={classes.icon}>
            <Icon />
          </div>
          <Typography color="textSecondary" variant="h3" align="center">
            <NullableText placeholder="Project Unnamed" value={projectName}>
              {projectName}
            </NullableText>
          </Typography>
          {projectDesc && (
            <Typography
              color="textSecondary"
              variant="h5"
              align="center"
              className={classes.desc}
            >
              {projectDesc}
            </Typography>
          )}
        </div>
      </LoaderLayout>
    </AbsoluteLayout>
  );
}

export default Project;
