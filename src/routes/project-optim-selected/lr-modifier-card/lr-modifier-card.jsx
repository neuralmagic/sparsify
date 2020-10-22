import React, { useState } from "react";
import PropTypes from "prop-types";

import { summarizeLearningRateValues, updateOptimsThunk } from "../../../store";
import { scientificNumber } from "../../../components";
import LearningRateChart from "../../../components/learning-rate-chart";
import OptimAdvancedLRDialog from "../../../modals/optim-advanced-lr";
import DisplayCard from "../../../components/display-card";
import DisplayCardActions from "../../../components/display-card-actions";
import EpochRange from "../../../components/epoch-range";
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

  return (
    <DisplayCard showEditButton={true} onEditClick={() => setAdvancedOpen(true)}>
      <DisplayCardMetrics metricsGroups={metricsGroups} />

      <DisplayCardBody>
        <LearningRateChart lrSummaries={lrSummaries} />
      </DisplayCardBody>

      <DisplayCardActions>
        <EpochRange
          label="Active Epoch Range"
          disabled={true}
          startEpoch={startEpoch}
          endEpoch={endEpoch}
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
