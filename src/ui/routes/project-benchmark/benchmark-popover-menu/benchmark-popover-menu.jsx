/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

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
import PropTypes from "prop-types";
import { IconButton, Divider, Popover, Button } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import makeStyles from "./benchmark-popover-styles";

const useStyles = makeStyles();

function BenchmarkPopoverMenu({ handleDelete, handleRerun }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const classes = useStyles();
  return (
    <div>
      <IconButton
        size="small"
        className={classes.editButton}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        classes={{ paper: classes.popoverMenu }}
        open={menuAnchor ? true : false}
        onClose={() => setMenuAnchor(null)}
        anchorEl={menuAnchor}
      >
        <Button
          fullWidth
          className={classes.textButton}
          onClick={() => {
            setMenuAnchor(null);
            handleRerun();
          }}
        >
          Re-run Benchmark
        </Button>
        <Divider />
        <Button
          fullWidth
          className={classes.textButton}
          onClick={() => {
            setMenuAnchor(null);
            handleDelete();
          }}
        >
          Remove
        </Button>
      </Popover>
    </div>
  );
}

BenchmarkPopoverMenu.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleRerun: PropTypes.func.isRequired,
};

export default BenchmarkPopoverMenu;
