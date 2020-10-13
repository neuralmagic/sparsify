import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Divider, List, ListItem, Typography } from "@material-ui/core";
import moment from "moment";

import { getProjectsThunk, selectProjectsState } from "../../store";
import makeStyles from "./home-sidenav-styles";
import ScrollerLayout from "../../components/scroller-layout";
import AbsoluteLayout from "../../components/absolute-layout";
import LoaderLayout from "../../components/loader-layout";
import NullableText from "../../components/nullable-text";

const useStyles = makeStyles();

function HomeSideNav() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const projectsState = useSelector(selectProjectsState);

  // make a request each time component loads to make sure projects are always up to date
  useEffect(() => {
    dispatch(getProjectsThunk());
  }, [dispatch]);

  return (
    <AbsoluteLayout>
      <Divider />
      <ScrollerLayout spacingTop={1}>
        <LoaderLayout
          error={projectsState.error}
          status={projectsState.status}
          errorTitle="Error loading projects"
        >
          <List className={classes.listRoot}>
            {projectsState && projectsState.val.length === 0 && (
              <Typography
                color="textPrimary"
                variant="body1"
                className={classes.noProjectTitle}
              >
                No projects found, add one using the New Project button
              </Typography>
            )}
            {projectsState.val.map((project) => (
              <ListItem button key={project.project_id}>
                <Link
                  to={`/project/${project.project_id}`}
                  className={classes.projectCard}
                >
                  <Typography
                    color="textPrimary"
                    variant="body1"
                    noWrap
                    className={classes.projectCardTitle}
                  >
                    <NullableText placeholder="Unspecified" value={project.name}>
                      {project.name ? project.name : ""}
                    </NullableText>
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    noWrap
                    className={classes.projectCardSubTitle}
                  >
                    {moment.utc(project.modified).local().fromNow()}
                  </Typography>
                </Link>
              </ListItem>
            ))}
          </List>
        </LoaderLayout>
      </ScrollerLayout>
    </AbsoluteLayout>
  );
}

export default HomeSideNav;
