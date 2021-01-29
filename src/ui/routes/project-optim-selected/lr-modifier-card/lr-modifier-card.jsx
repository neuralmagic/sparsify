/*
Copyright 2021-present Neuralmagic, Inc.

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

import { summarizeLRModifier, updateOptimsThunk } from "../../../store";
import { scientificNumber } from "../../../components";
import ChartLearningRate from "../../../components/chart-learning-rate";
import OptimAdvancedLRDialog from "../../../modals/optim-advanced-lr";
import DisplayCard from "../../../components/display-card";
import DisplayCardActions from "../../../components/display-card-actions";
import DisplayEpochRange from "../../../components/display-epoch-range";
import DisplayCardBody from "../../../components/display-card-body";
import DisplayCardMetrics from "../../../components/display-card-metrics";

const LRModifierCard = ({
  projectId,
  optimId,
  modifier,
  globalStartEpoch,
  globalEndEpoch,
}) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const modSummary = summarizeLRModifier(modifier, globalStartEpoch, globalEndEpoch);

  return (
    <DisplayCard showEditButton={true} onEditClick={() => setAdvancedOpen(true)}>
      <DisplayCardMetrics metricsGroups={modSummary.metricsGroups} />

      <DisplayCardBody>
        <ChartLearningRate lrSummaries={modSummary.summaries} />
      </DisplayCardBody>

      <DisplayCardActions>
        <DisplayEpochRange
          label="Active Epoch Range"
          disabled={true}
          startEpoch={`${modSummary.startEpoch}`}
          endEpoch={`${modSummary.endEpoch}`}
        />
      </DisplayCardActions>

      <OptimAdvancedLRDialog
        projectId={projectId}
        optimId={optimId}
        modifier={modifier}
        globalStartEpoch={globalStartEpoch}
        globalEndEpoch={globalEndEpoch}
        open={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
      />
    </DisplayCard>
  );
};

LRModifierCard.propTypes = {
  projectId: PropTypes.string.isRequired,
  optimId: PropTypes.string.isRequired,
  modifier: PropTypes.object.isRequired,
  globalStartEpoch: PropTypes.number.isRequired,
  globalEndEpoch: PropTypes.number.isRequired,
};

export default LRModifierCard;
