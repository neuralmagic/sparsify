import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Button,
  List,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { scientificNumber } from "../../components";

import makeStyles from "./optim-advanced-lr-styles";
import { summarizeLearningRateValues, updateOptimsModifierThunk } from "../../store";
import LearningRateChart from "../../components/learning-rate-chart";
import ScrollerLayout from "../../components/scroller-layout";
import LRModRow from "./lr-mod-row";
import DisplayCardMetrics from "../../components/display-card-metrics";
import DisplayCardBody from "../../components/display-card-body";
import EpochRange from "../../components/epoch-range";
import DisplayCardActions from "../../components/display-card-actions";
import LRModHeader from "./lr-mod-header";

const useStyles = makeStyles();

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
  const metricsGroups = [
    {
      title: "Summary",
      metrics: [
        { title: "Initial LR", value: scientificNumber(initLR) },
        { title: "Final LR", value: scientificNumber(finalLR) },
      ],
    },
  ];

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
        <div className={classes.layout}>
          <div className={classes.summary}>
            <DisplayCardMetrics metricsGroups={metricsGroups} />

            <DisplayCardBody>
              <LearningRateChart lrSummaries={lrSummaries} />
            </DisplayCardBody>

            <DisplayCardActions noMargin={true}>
              <EpochRange
                label="Active Epoch Range"
                disabled={true}
                startEpoch={startEpoch}
                endEpoch={endEpoch}
              />
            </DisplayCardActions>
          </div>

          <div className={classes.modifiers}>
            <LRModHeader addDisabled={showAdd} onAdd={() => setShowAdd(true)} />

            <div className={classes.scroller}>
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OptimAdvancedLRDialog;
