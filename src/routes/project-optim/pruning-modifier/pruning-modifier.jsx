import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Grid, TextField, Slider, IconButton } from "@material-ui/core"
import LayersChart from "../../../components/layers-chart"
import MetricItem from "../../../components/metric-item"
import AdvancedPruning from '../../../modals/optim-advanced-pruning'
import EditIcon from '@material-ui/icons/Edit'

import { formatWithMantissa } from '../../../components'
import makeStyles from "./pruning-modifier-styles";

import { changeModifierSettingsThunk } from "../../../store";

const useStyles = makeStyles();

const PruningModifier = ({ modifier, optim }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [advancedModalOpen, setAdvancedModalOpen] = useState(false)

  return (
    <Grid container key={modifier.modifier_id} direction="row">
      <Grid direction="column" xs={1}>
        <MetricItem
          label="Est. Speedup"
          value={formatWithMantissa(2, modifier.est_perf_gain)}
        />
        <MetricItem
          label="Est. Time"
          value={formatWithMantissa(4, modifier.est_time)}
        />
        <MetricItem
          label="Recoverability"
          value={formatWithMantissa(4, modifier.est_recovery)}
        />
      </Grid>
      <Grid item xs={8}>
        <LayersChart
          data={modifier.nodes}
          sparsityProp="sparsity"
          denseProp="est_time"
          sparseProp="est_time_baseline"
        />
      </Grid>
      <Grid item container xs={3} direction="column" spacing={2}>
        <Grid item container justify="flex-end">
          <IconButton className={classes.closeButton} onClick={() => setAdvancedModalOpen(true)}>
            <EditIcon/>
          </IconButton>
        </Grid>
        <Grid item container direction="row">
          <Grid item>
            <TextField
              value={`${Math.round(modifier.sparsity * 100)}%`}
              className={classes.sparsityInput}
              size="small"
              variant="outlined"
              label="Sparsity"
            />
          </Grid>
          <Grid item xs>
            <Slider
              value={modifier.sparsity * 100}
              onChange={(e, value) =>
                dispatch(
                  changeModifierSettingsThunk({
                    projectId: optim.project_id,
                    optimId: optim.optim_id,
                    modifierId: modifier.modifier_id,
                    settings: { sparsity: value / 100 },
                  })
                )
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <AdvancedPruning
        modifier={modifier}
        optim={optim}
        open={advancedModalOpen}
        onClose={() => setAdvancedModalOpen(false)}/>
    </Grid>
  );
};

PruningModifier.propTypes = {
  optim: PropTypes.object.isRequired,
  modifier: PropTypes.object.isRequired,
};

export default PruningModifier;
