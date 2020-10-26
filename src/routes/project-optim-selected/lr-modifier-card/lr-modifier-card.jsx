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
  const modSummary = summarizeLRModifier(
    modifier,
    globalStartEpoch,
    globalEndEpoch
  );

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
