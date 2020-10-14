import React from "react";
import PropTypes from "prop-types";
import { Card, Typography } from "@material-ui/core";

import ScrollerLayout from "../../../components/scroller-layout";
import LoaderLayout from "../../../components/loader-layout";
import PruningModifier from "../pruning-modifier";

import makeStyles from "./optim-pruning-styles";

const useStyles = makeStyles();

const OptimPruning = ({ optim }) => {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <div className={classes.title}>
        <Typography color="textSecondary" variant="h5">
          Pruning
        </Typography>
      </div>
      <Card elevation={1} className={classes.card}>
        {optim &&
          optim.pruning_modifiers.map((modifier) => (
            <PruningModifier
              key={modifier.modifier_id}
              modifier={modifier}
              optim={optim}
            />
          ))}
      </Card>
    </div>
  );
};

OptimPruning.propTypes = {
  optim: PropTypes.object.isRequired,
};

export default OptimPruning;
