import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  MenuItem,
  Button,
  List,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import {
  lrModsTypes,
  scientificNumber,
} from "../../components";

import makeStyles from "./optim-advanced-lr-styles";
import {
  summarizeLearningRateValues,
  updateOptimsModifierThunk,
} from "../../store";
import DisplayMetric from "../../components/display-metric";
import LearningRateChart from "../../components/learning-rate-chart";
import ScrollerLayout from "../../components/scroller-layout";
import useLRModState from "./hooks/use-lr-mod-state";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles();

function LRModRow({ lrModIndex, lrMod, onSave, onDelete }) {
  const classes = useStyles();
  const {
    changeValue,
    clearChanged,
    saveChanged,
    values,
    saveValues,
    saveOptions,
  } = useLRModState(lrMod);
  const options = [];

  if (values.clazz === "step") {
    options.push({
      key: "step_size",
      label: "Step Size",
    });
  }

  if (values.clazz === "multi_step") {
    options.push({
      key: "milestones",
      label: "Step Milestones",
    });
  }

  if (
    values.clazz === "step" ||
    values.clazz === "multi_step" ||
    values.clazz === "exponential"
  ) {
    options.push({
      key: "gamma",
      label: "Gamma",
    });
  }

  function handleSave() {
    saveChanged();

    if (onSave) {
      onSave(saveValues, lrModIndex);
    }
  }

  function handleClear() {
    clearChanged();
  }

  function handleDelete() {
    if (onDelete) {
      onDelete(lrModIndex);
    }
  }

  return (
    <div className={classes.lrModRow}>
      <div className={`${classes.lrRowItem} ${classes.lrModType}`}>
        <TextField
          select
          className={classes.lrModTypeSelector}
          value={values.clazz}
          onChange={(e) => changeValue("clazz", e.target.value)}
        >
          {lrModsTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className={classes.lrRowItem}>
        <TextField
          type="text"
          label="Start"
          className={classes.lrModEpoch}
          value={values.start_epoch}
          onChange={(e) => changeValue("start_epoch", e.target.value)}
        />
        {values.clazz !== "set" && (
          <TextField
            type="text"
            label="End"
            className={classes.lrModEpoch}
            value={values.end_epoch}
            onChange={(e) => changeValue("end_epoch", e.target.value)}
          />
        )}
      </div>

      <div className={classes.lrModOptions}>
        <TextField
          type="text"
          label="Initial LR"
          className={classes.lrModOption}
          value={values.init_lr}
          onChange={(e) => changeValue("init_lr", e.target.value)}
        />

        {options.map((option) => (
          <TextField
            key={option.key}
            type="text"
            label={option.label}
            className={classes.lrModOption}
            value={values.args[option.key]}
            onChange={(e) => changeValue(option.key, e.target.value)}
          />
        ))}
      </div>

      <div className={classes.lrModButtons}>
        {(saveOptions.dirty || lrModIndex === "add") && (
          <IconButton
            className={classes.actionButton}
            onClick={() => handleSave()}
            size="small"
          >
            <SaveIcon />
          </IconButton>
        )}
        {saveOptions.dirty && lrModIndex !== "add" && (
          <IconButton
            className={classes.actionButton}
            onClick={() => handleClear()}
            size="small"
          >
            <HighlightOffIcon />
          </IconButton>
        )}
        <IconButton
          className={classes.actionButton}
          onClick={handleDelete}
          size="small"
        >
          <DeleteOutlineIcon />
        </IconButton>
      </div>
    </div>
  );
}

function OptimAdvancedLRDialog({
  projectId,
  optimId,
  modifier,
  globalStartEpoch,
  globalEndEpoch,
  open,
  onClose,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showAdd, setShowAdd] = useState(false);
  const [lrMods, setLRMods] = useState(null);

  useEffect(() => {
    if (!open && lrMods !== null) {
      setLRMods(null);
      setShowAdd(false);
    }

    if (open && lrMods === null) {
      setLRMods(modifier.lr_mods);
    }
  }, [open, modifier, lrMods, setLRMods, setShowAdd]);

  const addMod = {
    clazz: "set",
    start_epoch: 0,
    end_epoch: -1,
    init_lr: 0.1,
    args: {},
  };
  const startEpoch =
    modifier.start_epoch > -1 ? modifier.start_epoch : globalStartEpoch;
  const endEpoch = modifier.end_epoch > -1 ? modifier.end_epoch : globalEndEpoch;

  const lrSummaries = summarizeLearningRateValues(
    modifier,
    globalStartEpoch,
    globalEndEpoch
  );
  const initLR = lrSummaries ? lrSummaries.values.objects[0].value : null;
  const finalLR = lrSummaries
    ? lrSummaries.values.objects[lrSummaries.values.objects.length - 1].value
    : null;

  function lrModSave(lrMod, lrModIndex) {
    const updatedLRMods = [...lrMods];

    if (lrModIndex === "add") {
      setShowAdd(false);
      updatedLRMods.push({ ...lrMod });
    } else {
      updatedLRMods[lrModIndex] = { ...lrMod };
    }

    setLRMods(updatedLRMods);
    dispatch(
      updateOptimsModifierThunk({
        projectId,
        optimId,
        modifierId: modifier.modifier_id,
        modifierType: "lr",
        properties: {
          lr_mods: updatedLRMods,
        },
      })
    );
  }

  function lrModDelete(lrModIndex) {
    if (lrModIndex === "add") {
      setShowAdd(false);

      return;
    }

    const updatedLRMods = [...lrMods];
    updatedLRMods.splice(lrModIndex, 1);
    setLRMods(updatedLRMods);
    dispatch(
      updateOptimsModifierThunk({
        projectId,
        optimId,
        modifierId: modifier.modifier_id,
        modifierType: "lr",
        properties: {
          lr_mods: updatedLRMods,
        },
      })
    );
  }

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogTitle>Learning Rate Editor</DialogTitle>
      <IconButton className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogContent className={classes.content}>
        <div className={classes.chartMetrics}>
          <div className={classes.metrics}>
            <DisplayMetric title="Initial LR" size="large" rootClass={classes.metric}>
              {scientificNumber(initLR)}
            </DisplayMetric>
            <DisplayMetric title="Final LR" size="large" rootClass={classes.metric}>
              {scientificNumber(finalLR)}
            </DisplayMetric>
            <div className={classes.metricsDiv} />
          </div>

          <div className={classes.chart}>
            <LearningRateChart lrSummaries={lrSummaries} />
          </div>

          <div className={classes.cardActions}>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              className={classes.epochLabel}
            >
              Active Epoch Range
            </Typography>
            <div className={classes.epochRange}>
              <TextField
                id="lrStartEpoch"
                variant="outlined"
                type="text"
                step={1.0}
                label="Start"
                value={startEpoch}
                disabled={true}
                className={classes.epochInput}
              />
              <div className={classes.epochDash} />
              <TextField
                id="lrEndEpoch"
                variant="outlined"
                type="text"
                step={1.0}
                label="End"
                value={endEpoch}
                disabled={true}
                className={classes.epochInput}
              />
            </div>
          </div>
        </div>
        <div className={classes.modifiers}>
          <div className={classes.modifiersHeader}>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              className={classes.lrRowItem}
            >
              LR Schedules
            </Typography>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              className={classes.lrRowItem}
            >
              Active Epoch Range
            </Typography>
            <Typography color="textSecondary" variant="subtitle2">
              Options
            </Typography>
            <div style={{ flex: "1 0" }} />
            {!showAdd && (
              <Button color="primary" onClick={() => setShowAdd(true)}>
                <AddCircleOutlineIcon style={{ marginRight: "8px" }} /> Add LR Schedule
              </Button>
            )}
          </div>
          <ScrollerLayout rootClass={classes.scrollerRoot}>
            {open && lrMods && (
              <List className={classes.modifiersList}>
                {lrMods.map((mod, index) => (
                  <div key={index}>
                    {index > 0 && <Divider />}
                    <LRModRow
                      lrModIndex={index}
                      lrMod={mod}
                      onSave={lrModSave}
                      onDelete={lrModDelete}
                    />
                  </div>
                ))}

                {showAdd && (
                  <div key="add">
                    {lrMods.length > 0 && <Divider />}
                    <LRModRow
                      lrModIndex="add"
                      lrMod={addMod}
                      onSave={lrModSave}
                      onDelete={lrModDelete}
                    />
                  </div>
                )}
              </List>
            )}
          </ScrollerLayout>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OptimAdvancedLRDialog;
