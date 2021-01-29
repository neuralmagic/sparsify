/*
Copyright 2021-present Neuralmagic, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Fab } from "@material-ui/core";

import { selectSelectedProjectState } from "../../store";
import makeStyles from "./project-optim-styles";
import GenericPage from "../../components/generic-page";
import AbsoluteLayout from "../../components/absolute-layout";
import { ReactComponent as Icon } from "./img/icon.svg";
import AddIcon from "@material-ui/icons/Add";
import OptimCreateDialog from "../../modals/optim-create/optim-create-dialog";

const useStyles = makeStyles();

function ProjectOptim() {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(true);

  const selectedProjectState = useSelector(selectSelectedProjectState);

  return (
    <AbsoluteLayout>
      <GenericPage
        logoComponent={<Icon />}
        title="Optimization"
        description="Optimize, retrain, and utilize Neural Magic to achieve smaller models and faster inference."
      />
      <Fab
        variant="extended"
        color="secondary"
        aria-label="New Project"
        className={classes.fab}
        onClick={() => setModalOpen(true)}
      >
        <AddIcon className={classes.fabIcon} />
        Create
      </Fab>
      <OptimCreateDialog
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        projectId={selectedProjectState.projectId}
      />
    </AbsoluteLayout>
  );
}

export default ProjectOptim;
