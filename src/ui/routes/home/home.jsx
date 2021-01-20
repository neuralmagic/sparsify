import React, { useState } from "react";
import { Fab, IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import makeStyles from "./home-styles";
import AbsoluteLayout from "../../components/absolute-layout";
import ProjectCreateDialog from "../../modals/project-create";
import { ReactComponent as AnalyzeIcon } from "./img/analyze.svg";
import { ReactComponent as IntegrateIcon } from "./img/integrate.svg";
import { ReactComponent as OptimizeIcon } from "./img/optimize.svg";
import DisplayAction from "./display-action";

const useStyles = makeStyles();

function Home() {
  const classes = useStyles();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <AbsoluteLayout>
      <div className={classes.content}>
        <Typography
          className={classes.titleText}
          color="textPrimary"
          variant="h5"
          align="center"
        >
          Follow three simple steps to maximize your model's performance and ensure
          compatibility with the Deepsparse Engine.
        </Typography>

        <div className={classes.displayActions}>
          <DisplayAction
            headerText="Analyze"
            bodyText="Create a project, upload a model, and Sparsify will estimate a speedup."
          >
            <AnalyzeIcon />
          </DisplayAction>
          <DisplayAction
            headerText="Optimize"
            bodyText="Apply the latest optimization techniques such as pruning and then benchmark."
          >
            <OptimizeIcon />
          </DisplayAction>
          <DisplayAction
            headerText="Integrate"
            bodyText="Export an optimization config, use this to retrain your model, and run."
          >
            <IntegrateIcon />
          </DisplayAction>
        </div>
      </div>

      <Fab
        variant="extended"
        color="secondary"
        aria-label="New Project"
        className={classes.fab}
        onClick={() => setCreateOpen(true)}
      >
        <AddIcon className={classes.fabIcon} />
        New Project
      </Fab>

      <ProjectCreateDialog open={createOpen} handleClose={() => setCreateOpen(false)} />
    </AbsoluteLayout>
  );
}

export default Home;
