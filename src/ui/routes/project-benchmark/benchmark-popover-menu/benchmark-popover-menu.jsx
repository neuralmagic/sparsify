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
