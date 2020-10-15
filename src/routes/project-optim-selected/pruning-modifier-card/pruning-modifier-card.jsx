import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  TextField,
  Slider,
  IconButton,
  Popover,
  Typography,
  MenuItem,
  CardContent,
  Card,
} from "@material-ui/core";
import LayersChart from "../../../components/layers-chart";
import PruningSettings from "../../../components/pruning-settings";
import AdvancedPruning from "../../../modals/optim-advanced-pruning";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { formatWithMantissa } from "../../../components";
import makeStyles from "./pruning-modifier-styles";

import {
  selectModifierAdjustableSettings,
  changeModifierAdjustableSettings,
  selectSelectedProjectPrunableNodesById,
} from "../../../store";
import DisplayMetric from "../../../components/display-metric";

const useStyles = makeStyles();

const PruningModifierCard = ({ modifier, optim }) => {
  const classes = useStyles();
  const [advancedModalOpen, setAdvancedModalOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const dispatch = useDispatch();
  const adjustableSettings = useSelector(
    selectModifierAdjustableSettings(modifier.modifier_id)
  );
  const layerData = useSelector(selectSelectedProjectPrunableNodesById);

  return (
    <Card elevation={1} className={classes.root}>
      <CardContent className={classes.layout}>
        <div className={classes.metrics}>
          <DisplayMetric title="Est. Speedup" size="large" rootClass={classes.metric}>
            {formatWithMantissa(2, modifier.est_perf_gain)}x
          </DisplayMetric>
          <DisplayMetric title="Est. Time" size="large" rootClass={classes.metric}>
            {formatWithMantissa(
              2,
              modifier.est_time ? modifier.est_time * 1000 : modifier.est_time
            )}{" "}
            ms
          </DisplayMetric>
          <DisplayMetric title="Recoverability" size="large" rootClass={classes.metric}>
            {formatWithMantissa(4, modifier.est_recovery)}
          </DisplayMetric>
          <div className={classes.metricsDiv} />
        </div>

        <div className={classes.chart}>
          <LayersChart
            data={modifier.nodes}
            layerData={layerData}
            sparsityProp="sparsity"
          />
        </div>

        <Grid item container direction="column" xs={1} className={classes.filtersRoot}>
          <Grid item container justify="flex-end">
            <IconButton
              className={classes.editButton}
              onClick={() => setAdvancedModalOpen(true)}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className={classes.menuButton}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              classes={{ paper: classes.popoverMenu }}
              open={menuAnchor}
              onClose={() => setMenuAnchor(null)}
              anchorEl={menuAnchor}
            >
              <TextField
                select
                className={classes.pruningTypeSelect}
                value="unstructured"
                variant="outlined"
                label="Pruning type"
              >
                <MenuItem value="unstructured">Unstructured</MenuItem>
              </TextField>
              <Typography className={classes.presetFiltersTitle}>
                Preset filters
              </Typography>
              {[
                {
                  name: "filter_min_sparsity",
                  label: "Min sparsity",
                  value: Math.round(adjustableSettings.filter_min_sparsity * 100),
                  suffix: "%",
                },
                {
                  name: "filter_min_perf_gain",
                  label: "Performance",
                  value: Math.round(adjustableSettings.filter_min_perf_gain * 100),
                  suffix: "%",
                },
                {
                  name: "filter_max_loss_drop",
                  label: "Loss",
                  value: adjustableSettings.filter_max_loss_drop,
                  divideBy100: false,
                  max: 1,
                  step: 0.01,
                },
              ].map(
                ({
                  name,
                  value,
                  label,
                  min = 0,
                  max = 100,
                  step = 1,
                  divideBy100 = true,
                  suffix = "",
                }) => (
                  <Grid
                    key={name}
                    item
                    container
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Grid item>
                      <TextField
                        value={`${value || 0}${suffix}`}
                        className={classes.popoverInput}
                        size="small"
                        variant="outlined"
                        label={label}
                      />
                    </Grid>
                    <Grid item xs>
                      <Slider
                        className={classes.popoverSlider}
                        value={value}
                        min={min}
                        max={max}
                        step={step}
                        onChange={(e, value) =>
                          dispatch(
                            changeModifierAdjustableSettings({
                              modifierId: modifier.modifier_id,
                              settings: { [name]: divideBy100 ? value / 100 : value },
                            })
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                )
              )}
            </Popover>
          </Grid>
          <ModifierSparsitySlider modifier={modifier} classes={classes} />
          <PruningSettings modifier={modifier} showRecovery={false} />
        </Grid>
        <AdvancedPruning
          modifier={modifier}
          optim={optim}
          open={advancedModalOpen}
          onClose={() => setAdvancedModalOpen(false)}
        />
      </CardContent>
    </Card>
  );
};

const ModifierSparsitySlider = ({ modifier, classes }) => {
  const dispatch = useDispatch();
  const adjustableSettings = useSelector(
    selectModifierAdjustableSettings(modifier.modifier_id)
  );

  return (
    <Grid
      className={classes.sparsitySliderRoot}
      item
      container
      direction="row"
      alignItems="center"
    >
      <Grid item>
        <TextField
          value={`${Math.round(adjustableSettings.sparsity * 100)}%`}
          className={classes.sparsityInput}
          size="small"
          variant="outlined"
          label="Sparsity"
        />
      </Grid>
      <Grid item xs>
        <Slider
          value={adjustableSettings.sparsity * 100}
          onChange={(e, value) =>
            dispatch(
              changeModifierAdjustableSettings({
                modifierId: modifier.modifier_id,
                settings: { sparsity: value / 100 },
              })
            )
          }
        />
      </Grid>
    </Grid>
  );
};

PruningModifierCard.propTypes = {
  optim: PropTypes.object.isRequired,
  modifier: PropTypes.object.isRequired,
};

export default PruningModifierCard;
