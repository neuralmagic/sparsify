import React from "react";

import { Box, Typography } from "@material-ui/core";
import makeStyles from "../optim-create-styles";

const useStyles = makeStyles();
function PresetOptimSelect() {
  const classes = useStyles();

  return (
    <Box paddingTop={2} paddingBottom={4}>
      <Box marginTop={2} height="30vh">
        <Box
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          className={classes.noPresetsLabel}
        >
          <Typography color="textSecondary">Coming Soon</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default PresetOptimSelect;
