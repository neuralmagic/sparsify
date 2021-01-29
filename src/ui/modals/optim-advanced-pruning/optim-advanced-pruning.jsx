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

import {
  compose,
  filter,
  prop,
  defaultTo,
  sortBy,
  when,
  always,
  not,
  isNil,
  toPairs,
  map,
  objOf,
  of as rof,
  indexOf,
  head,
  last,
  cond,
  T,
  test,
  gt,
  __,
  times,
  identity,
} from "ramda";
import React, { useState } from "react";
import * as d3 from "d3";
import clsx from "clsx";
import { ResponsiveLine } from "@nivo/line";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  IconButton,
  Grid,
  TextField,
  Table,
  TableBody,
  Dialog,
  DialogTitle,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Slider,
  DialogContent,
  Collapse,
  InputAdornment,
} from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronRight from "@material-ui/icons/ChevronRight";
import SearchIcon from "@material-ui/icons/Search";
import { formatWithMantissa } from "../../components";

import makeStyles, {
  makeTableStyles,
  makeTableRowStyles,
} from "./optim-advanced-pruning-styles";
import {
  selectModifierAdjustableSettings,
  changeModifierAdjustableSettings,
  changeLayerAdjustableSettings,
  selectLayerAdjustableSettings,
  selectSelectedProjectPrunableNodesById,
  summarizePruningModifier,
} from "../../store";

import { readableNumber } from "../../components";
import DisplayCardMetrics from "../../components/display-card-metrics";
import DisplayCardBody from "../../components/display-card-body";
import DisplayCardActions from "../../components/display-card-actions";
import DisplayEpochRange from "../../components/display-epoch-range";
import DisplayPruningSettings from "../../components/display-pruning-settings";
import DisplayTextField from "../../components/display-text-field";
import ChartPruning from "../../components/chart-pruning";

const useStyles = makeStyles();
const tableStyles = makeTableStyles();
const tableRowStyles = makeTableRowStyles();

const LayerMeasurementsChart = withTheme(({ data, xAxisLabel, yAxisLabel, theme }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
    xScale={{ type: "point" }}
    yScale={{ type: "linear", min: "auto", max: "auto", reverse: false }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      legend: xAxisLabel,
      legendPosition: "middle",
      legendOffset: 10,
      tickSize: 0,
      tickPadding: 5,
      tickRotation: 0,
      tickValues: [head(data[0].data).x, last(data[0].data).x],
    }}
    axisLeft={{
      orient: "left",
      legend: yAxisLabel,
      tickSize: 0,
      legendPosition: "middle",
      legendOffset: -20,
      tickValues: [],
    }}
    enableGridX={false}
    colors={[theme.palette.primary.main]}
    enablePoints={false}
    enableArea={true}
    useMesh={true}
    enableCrosshair={false}
    areaOpacity={0.3}
    isInteractive={true}
    animate={false}
  />
));

const LayersTableRow = ({
  modifier,
  layer,
  data,
  lossLayerIndex,
  perfLayerIndex,
  totalLayers,
}) => {
  const classes = tableRowStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const layerSettings = useSelector(
    selectLayerAdjustableSettings(modifier.modifier_id, layer.node_id)
  );
  const changeLayerSettings = (settings, commit = false) =>
    dispatch(
      changeLayerAdjustableSettings({
        modifierId: modifier.modifier_id,
        layerId: layer.node_id,
        settings,
        commit,
      })
    );

  const asChartData = compose(
    rof,
    objOf("data"),
    sortBy(prop("x")),
    map((values) => ({ x: values[0], y: defaultTo(0, values[1]) })),
    toPairs
  );

  const interval = times(identity, totalLayers);
  const sensitivityLabel = (interval, value) =>
    cond([
      [
        gt(d3.quantile(interval, 0.33)),
        (v) => ({ value: `Low (${formatWithMantissa(2, v)})`, type: "low" }),
      ],
      [
        gt(d3.quantile(interval, 0.66)),
        (v) => ({ value: `Medium (${formatWithMantissa(2, v)})`, type: "medium" }),
      ],
      [
        gt(d3.quantile(interval, 0.95)),
        (v) => ({ value: `High (${formatWithMantissa(2, v)})`, type: "high" }),
      ],
      [T, (v) => ({ value: `Top 5% (${formatWithMantissa(2, v)})`, type: "top" })],
    ])(value);

  const lossSensitivity = sensitivityLabel(interval, lossLayerIndex);
  const perfSensitivity = sensitivityLabel(interval, perfLayerIndex);

  const SectionText = ({ children }) => (
    <Grid item className={classes.layerDetailsSectionText}>
      {children}
    </Grid>
  );

  return (
    <React.Fragment>
      <TableRow
        key={layer.node_id}
        className={clsx(classes.root, {
          [classes.disabled]: layerSettings.sparsity === null,
        })}
      >
        <TableCell className={classes.layerNameTableCell} style={{ paddingLeft: 0 }}>
          <Typography className={classes.layerIndexText}>{data.index + 1}.</Typography>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
          <Typography>{data.weight_name}</Typography>
        </TableCell>
        <TableCell>
          <div className={classes.sparsityCell}>
            <Switch
              checked={layerSettings.sparsity !== null}
              color="primary"
              onChange={(e) =>
                changeLayerSettings({
                  sparsity: e.target.checked ? modifier.sparsity : null,
                })
              }
            />
            {layerSettings.sparsity !== null && (
              <Slider
                value={layerSettings.sparsity * 100}
                min={0}
                max={100}
                onChange={(e, value) =>
                  changeLayerSettings({ sparsity: Number(value) / 100 })
                }
                onChangeCommitted={(e, value) =>
                  changeLayerSettings({ sparsity: Number(value) / 100 }, true)
                }
              />
            )}
            <Typography className={classes.sparsityValue}>
              {layerSettings.sparsity
                ? `${formatWithMantissa(1, layerSettings.sparsity * 100)}%`
                : ""}
            </Typography>
          </div>
        </TableCell>
        <TableCell>
          <Typography>{formatWithMantissa(3, layer.est_recovery)}</Typography>
        </TableCell>
        <TableCell>
          <Typography>
            {layer.est_time_gain && layerSettings.sparsity !== null
              ? `${formatWithMantissa(1, layer.est_time_gain)}x`
              : "-"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography>
            {layerSettings.sparsity !== null
              ? formatWithMantissa(4, layer.est_time)
              : "-"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography>
            {layerSettings.sparsity !== null
              ? formatWithMantissa(4, layer.est_time_baseline)
              : "-"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            className={clsx(classes.sensitivityLabel, { [lossSensitivity.type]: true })}
          >
            {lossSensitivity.value}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            className={clsx(classes.sensitivityLabel, { [perfSensitivity.type]: true })}
          >
            {perfSensitivity.value}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={8}>
          <Collapse in={open} unmountOnExit>
            <Grid container direction="row" className={classes.layerDetails}>
              <Grid item direction="column" className={classes.layerDetailsSection}>
                <Grid item className={classes.layerDetailsSectionHeader}>
                  Measures
                </Grid>
                <Grid item>
                  <Grid container direction="row" spacing={2}>
                    <Grid item direction="column">
                      <SectionText>Current parameters</SectionText>
                      <SectionText>Baseline parameters</SectionText>
                      <SectionText>Current FLOPS</SectionText>
                      <SectionText>Baseline FLOPS</SectionText>
                    </Grid>
                    <Grid item direction="column">
                      <Grid item>{readableNumber(layer.params)}</Grid>
                      <Grid item>{readableNumber(layer.params_baseline)}</Grid>
                      <Grid item>{readableNumber(layer.flops)}</Grid>
                      <Grid item>{readableNumber(layer.flops_baseline)}</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item direction="column" className={classes.layerDetailsSection}>
                <Grid item className={classes.layerDetailsSectionHeader}>
                  Layer attributes
                </Grid>
                <Grid item>
                  <Grid container direction="row" spacing={2}>
                    <Grid item direction="column">
                      <SectionText>Type</SectionText>
                      <SectionText>Dilations</SectionText>
                      <SectionText>Group</SectionText>
                      <SectionText>Kernel_shape</SectionText>
                    </Grid>
                    <Grid item direction="column">
                      <Grid item>{data.op_type}</Grid>
                      <Grid item>{data.attributes.dilations?.join(", ")}</Grid>
                      <Grid item>{data.attributes.group}</Grid>
                      <Grid item>{data.attributes.kernel_shape?.join(", ")}</Grid>
                    </Grid>
                    <Grid item direction="column">
                      <SectionText>Pads</SectionText>
                      <SectionText>Strides</SectionText>
                    </Grid>
                    <Grid item direction="column">
                      <Grid item>{data.attributes.pads?.join(", ")}</Grid>
                      <Grid item>{data.attributes.strides?.join(", ")}</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item direction="column" className={classes.layerDetailsSection}>
                <Grid item>Loss Sensitivity</Grid>
                <Grid item>
                  <div className={classes.chart}>
                    <LayerMeasurementsChart
                      data={asChartData(data.measurements.loss)}
                      xAxisLabel="Sparsity"
                      yAxisLabel="Sensitivity"
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid item direction="column" className={classes.layerDetailsSection}>
                <Grid item>Performance Sensitivity</Grid>
                <Grid item>
                  <div className={classes.chart}>
                    <LayerMeasurementsChart
                      data={asChartData(data.measurements.perf)}
                      xAxisLabel="Sparsity"
                      yAxisLabel="Sensitivity"
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const LayersTable = ({ modifier, layerData, className }) => {
  const classes = tableStyles();
  const [searchTerm, setSearchTerm] = useState(null);
  const sortedByLossSensitivity = sortBy(prop("est_loss_sensitivity"), modifier.nodes);
  const sortedByPerfSensitivity = sortBy(prop("est_perf_sensitivity"), modifier.nodes);

  const filteredLayers = compose(
    when(
      always(compose(not, isNil)(searchTerm)),
      filter(
        compose(
          test(new RegExp(searchTerm)),
          prop("weight_name"),
          prop(__, layerData),
          prop("node_id")
        )
      )
    ),
    defaultTo([])
  )(modifier.nodes);

  return (
    <TableContainer className={className}>
      <Table size="small">
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell style={{ paddingLeft: 0 }}>
              <TextField
                className={classes.searchInput}
                variant="outlined"
                placeholder="Search Layers"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className={classes.searchInputAdornment}
                    >
                      <SearchIcon size="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </TableCell>
            <TableCell>
              <Typography>Sparsity Level %</Typography>
            </TableCell>
            <TableCell>
              <Typography>Recoverability Score</Typography>
            </TableCell>
            <TableCell>
              <Typography>Est. Speedup Factor</Typography>
            </TableCell>
            <TableCell>
              <Typography>Est. Current Time</Typography>
            </TableCell>
            <TableCell>
              <Typography>Est. Baseline Time</Typography>
            </TableCell>
            <TableCell>
              <Typography>Loss Sensitivity</Typography>
            </TableCell>
            <TableCell>
              <Typography>Perf. Sensitivity</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLayers.map((layer) => (
            <LayersTableRow
              key={layer.node_id}
              modifier={modifier}
              layer={layer}
              data={layerData[layer.node_id]}
              lossLayerIndex={indexOf(layer, sortedByLossSensitivity)}
              perfLayerIndex={indexOf(layer, sortedByPerfSensitivity)}
              totalLayers={modifier.nodes.length}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function OptimAdvancedPruningDialog({ modifier, modelAnalysis, open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const adjustableSettings = useSelector(
    selectModifierAdjustableSettings(modifier.modifier_id)
  );
  const layerData = useSelector(selectSelectedProjectPrunableNodesById);
  const modSummary = summarizePruningModifier(modifier, modelAnalysis);

  function updateModifierValues(settings, commit) {
    dispatch(
      changeModifierAdjustableSettings({
        modifierId: modifier.modifier_id,
        settings,
        commit,
      })
    );
  }

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogTitle>Pruning Editor</DialogTitle>

      <IconButton className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>

      <DialogContent className={classes.content}>
        <div className={classes.layout}>
          <div className={classes.summary}>
            <DisplayCardMetrics metricsGroups={modSummary.metricsGroups} />

            <DisplayCardBody>
              <ChartPruning layerSummaries={modSummary.summaries} />
            </DisplayCardBody>

            <DisplayCardActions noMargin={true}>
              <DisplayPruningSettings
                sparsity={adjustableSettings.sparsity}
                perfRecoveryBalance={adjustableSettings.balance_perf_loss}
                filterSparsity={adjustableSettings.filter_min_sparsity}
                filterPerf={adjustableSettings.filter_min_perf_gain}
                filterRecovery={adjustableSettings.filter_min_recovery}
                onSparsityChange={(val, commit) =>
                  updateModifierValues({ sparsity: val }, commit)
                }
                onPerfRecoveryBalanceChange={(val, commit) =>
                  updateModifierValues({ balance_perf_loss: val }, commit)
                }
                onFilterSparsityChange={(val, commit) =>
                  updateModifierValues({ filter_min_sparsity: val }, commit)
                }
                onFilterPerfChange={(val, commit) =>
                  updateModifierValues({ filter_min_perf_gain: val }, commit)
                }
                onFilterRecoveryChange={(val, commit) =>
                  updateModifierValues({ filter_min_recovery: val }, commit)
                }
              />
              <DisplayEpochRange
                label="Active Epoch Range"
                startEpoch={`${adjustableSettings.start_epoch}`}
                endEpoch={`${adjustableSettings.end_epoch}`}
                onStartEpochChange={(value) =>
                  updateModifierValues({ start_epoch: value }, false)
                }
                onEndEpochChange={(value) =>
                  updateModifierValues({ end_epoch: value }, false)
                }
                onStartFinished={() =>
                  updateModifierValues(
                    { start_epoch: parseFloat(adjustableSettings.start_epoch) },
                    true
                  )
                }
                onEndFinished={() =>
                  updateModifierValues(
                    { end_epoch: parseFloat(adjustableSettings.end_epoch) },
                    true
                  )
                }
              />
              <DisplayTextField
                label="Update"
                className={classes.update}
                value={`${adjustableSettings.update_frequency}`}
                onValueChange={(value) =>
                  updateModifierValues({ update_frequency: value }, false)
                }
              />
            </DisplayCardActions>
          </div>

          <div className={classes.layers}>
            <LayersTable
              className={classes.layersTable}
              modifier={modifier}
              layerData={layerData}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OptimAdvancedPruningDialog;
