import React, { useState } from "react";
import { IconButton, Divider, Popover, Button } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import makeStyles from "./benchmark-popover-styles";

const useStyles = makeStyles();

function BenchmarkPopoverMenu({ handleDelete }) {
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
        <Button fullWidth className={classes.textButton} disabled={true}>
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

export default BenchmarkPopoverMenu;
