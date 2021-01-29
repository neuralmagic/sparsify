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
import { useDispatch, useSelector } from "react-redux";
import AdvancedPruning from "../../../modals/optim-advanced-pruning";

import makeStyles from "./pruning-modifier-styles";
import {
  selectModifierAdjustableSettings,
  changeModifierAdjustableSettings,
  summarizePruningModifier,
} from "../../../store";
import DisplayCard from "../../../components/display-card";
import DisplayCardMetrics from "../../../components/display-card-metrics";
import DisplayCardBody from "../../../components/display-card-body";
import DisplayCardActions from "../../../components/display-card-actions";
import DisplayEpochRange from "../../../components/display-epoch-range";
import DisplayTextField from "../../../components/display-text-field";
import ChartPruning from "../../../components/chart-pruning";
import DisplayPruningSettings from "../../../components/display-pruning-settings";

const useStyles = makeStyles();

const PruningModifierCard = ({ modifier, optim, modelAnalysis }) => {
  const classes = useStyles();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const dispatch = useDispatch();
  const adjustableSettings = useSelector(
    selectModifierAdjustableSettings(modifier.modifier_id)
  );
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
    <DisplayCard showEditButton={true} onEditClick={() => setAdvancedOpen(true)}>
      <DisplayCardMetrics metricsGroups={modSummary.metricsGroups} />

      <DisplayCardBody>
        <ChartPruning layerSummaries={modSummary.summaries} />
      </DisplayCardBody>

      <DisplayCardActions>
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

      <AdvancedPruning
        modifier={modifier}
        optim={optim}
        modelAnalysis={modelAnalysis}
        open={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
      />
    </DisplayCard>
  );
};

PruningModifierCard.propTypes = {
  optim: PropTypes.object.isRequired,
  modifier: PropTypes.object.isRequired,
  modelAnalysis: PropTypes.object.isRequired,
};

export default PruningModifierCard;
