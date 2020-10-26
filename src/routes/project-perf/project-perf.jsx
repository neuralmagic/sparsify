import React, { useEffect } from "react";
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

import ScrollerLayout from "../../components/scroller-layout";
import makeStyles from "./project-perf-styles";
import GenericPage from "../../components/generic-page";
import LoaderLayout from "../../components/loader-layout";
import {
  getOptimsBestEstimatedThunk,
  selectSelectedOptimsBestEstimated,
  selectSelectedProfilePerf,
  selectSelectedProfilePerfNodeResults,
  selectSelectedProfilePerfNodeSummaries,
  selectSelectedProfilesLossState,
  selectSelectedProfilesPerfState,
  selectSelectedProjectModelAnalysisBatchSize,
  selectSelectedProjectModelAnalysisPerfNodeResults,
  selectSelectedProjectModelAnalysisPerfNodeSummaries,
  selectSelectedProjectState,
  selectModalsState,
  setPerfModalOpen,
  STATUS_SUCCEEDED,
} from "../../store";
import { combineStatuses, readableNumber } from "../../components";
import ChartSummariesCard from "../../components/chart-summaries-card";
import ProfileSummaryCard from "../../components/profile-summary-card";
import PerfProfileCreateDialog from "../../modals/perf-profile-create";
const useStyles = makeStyles();

function baselineDisplayValues() {
  return {
    name: null,
    batchSize: null,
    coreCount: null,
    instructionSets: null,
    metricOne: { title: null, value: null },
    metricTwo: { title: null, value: null },
    metricThree: { title: null, value: null },
    metricFour: { title: null, value: null },
    expectedOptimizationText:
      "An estimated --- speedup could be achieved by optimizing.",
    extras: "",
    analysisSummaries: {},
    analysisResults: {},
  };
}

function analysisDisplayValues(
  bestEstimatedState,
  modelAnalysisBatchSize,
  modelAnalysisNodeSummaries,
  modelAnalysisNodeResults
) {
  const flops = bestEstimatedState.val ? bestEstimatedState.val.flops : null;
  const flopsBaseline = bestEstimatedState.val
    ? bestEstimatedState.val.flops_baseline
    : null;
  const params = bestEstimatedState.val ? bestEstimatedState.val.params : null;
  const paramsBaseline = bestEstimatedState.val
    ? bestEstimatedState.val.params_baseline
    : null;
  const flopsReduction =
    flops && flops > 0 && flopsBaseline
      ? readableNumber(flopsBaseline / flops, 2) + "x"
      : null;
  const paramsReduction =
    params && params > 0 && paramsBaseline
      ? readableNumber(paramsBaseline / params, 2) + "x"
      : null;

  return {
    name: "FLOPS Analysis",
    batchSize: modelAnalysisBatchSize,
    coreCount: null,
    instructionSets: null,
    metricOne: {
      title: "FLOPS",
      value: readableNumber(flopsBaseline, 1),
    },
    metricTwo: {
      title: "Params",
      value: readableNumber(paramsBaseline, 1),
    },
    metricThree: {
      title: "Estimated FLOPS Reduction",
      value: flopsReduction,
    },
    metricFour: {
      title: "Estimated Params Reduction",
      value: paramsReduction,
    },
    expectedOptimizationText: `An estimated ${
      flopsReduction ? flopsReduction : "---"
    } reduction in FLOPS could be achieved by optimizing.`,
    extras: "",
    analysisSummaries: modelAnalysisNodeSummaries,
    analysisResults: modelAnalysisNodeResults,
  };
}

function profilePerfDisplayValues(
  profilePerf,
  bestEstimatedState,
  profilePerfNodeSummaries,
  profilePerfNodeResults
) {
  const batchSize = profilePerf.batch_size;
  const msPerBatch = bestEstimatedState.val
    ? bestEstimatedState.val.est_time_baseline * 1000
    : null;
  const itemsPerSecond =
    msPerBatch && batchSize ? 1000 / (msPerBatch * batchSize) : null;
  const estMsPerBatch =
    bestEstimatedState.val && bestEstimatedState.val.est_time
      ? bestEstimatedState.val.est_time * 1000
      : null;
  const estPerfGain =
    bestEstimatedState.val && bestEstimatedState.val.est_time_gain
      ? `${readableNumber(bestEstimatedState.val.est_time_gain, 2)}x`
      : null;

  return {
    name: profilePerf.name ? profilePerf.name : "Unspecified",
    batchSize: batchSize,
    coreCount: profilePerf.core_count,
    instructionSets: profilePerf.instruction_sets
      ? profilePerf.instruction_sets.join(", ")
      : null,
    metricOne: {
      title: "MS per Batch",
      value: readableNumber(msPerBatch, 1),
    },
    metricTwo: {
      title: "Items per Second",
      value: readableNumber(itemsPerSecond, 1),
    },
    metricThree: {
      title: "Estimated MS per Batch",
      value: readableNumber(estMsPerBatch, 1),
    },
    metricFour: {
      title: "Estimated Performance Speedup",
      value: estPerfGain,
    },
    expectedOptimizationText: `An estimated ${
      estPerfGain ? estPerfGain : "---"
    } speedup could be achieved by optimizing.`,
    extras: moment(profilePerf.created).format("MM/DD/YYYY h:mma"),
    analysisSummaries: profilePerfNodeSummaries,
    analysisResults: profilePerfNodeResults,
  };
}

function ProjectPerf(props) {
  const { projectId } = props.match.params;
  const classes = useStyles();
  const dispatch = useDispatch();

  const projectState = useSelector(selectSelectedProjectState);
  const profilesPerfState = useSelector(selectSelectedProfilesPerfState);
  const profilePerf = useSelector(selectSelectedProfilePerf);
  const profilesLossState = useSelector(selectSelectedProfilesLossState);
  const bestEstimatedState = useSelector(selectSelectedOptimsBestEstimated);
  const modelAnalysisBatchSize = useSelector(
    selectSelectedProjectModelAnalysisBatchSize
  );
  const modelAnalysisNodeSummaries = useSelector(
    selectSelectedProjectModelAnalysisPerfNodeSummaries
  );
  const modelAnalysisNodeResults = useSelector(
    selectSelectedProjectModelAnalysisPerfNodeResults
  );
  const profilePerfNodeSummaries = useSelector(selectSelectedProfilePerfNodeSummaries);
  const profilePerfNodeResults = useSelector(selectSelectedProfilePerfNodeResults);
  const modalsState = useSelector(selectModalsState);
  const profilePerfId = profilePerf ? profilePerf.profile_id : null;
  const firstLossProfile =
    profilesLossState.val && profilesLossState.val.length > 0
      ? profilesLossState.val[0]
      : null;
  const firstLossProfileId = firstLossProfile ? firstLossProfile.profile_id : null;

  useEffect(() => {
    // make sure all desired requests are finished first,
    // then make the best estimated request if it hasn't been made yet
    if (
      projectState.status === STATUS_SUCCEEDED &&
      profilesPerfState.status === STATUS_SUCCEEDED &&
      profilesLossState.status === STATUS_SUCCEEDED
    ) {
      const requestMatches =
        projectState.projectId === bestEstimatedState.projectId &&
        profilePerfId === bestEstimatedState.profilePerfId &&
        firstLossProfileId === bestEstimatedState.profileLossId;

      if (!requestMatches) {
        dispatch(
          getOptimsBestEstimatedThunk({
            projectId: projectState.projectId,
            profilePerfId: profilePerfId,
            profileLossId: firstLossProfileId,
          })
        );
      }
    }
  }, [
    projectState,
    profilesPerfState,
    profilesLossState,
    dispatch,
    profilePerfId,
    firstLossProfileId,
    bestEstimatedState,
  ]);

  const overallStatus = combineStatuses([
    projectState.status,
    profilesPerfState.status,
  ]);
  let overallError = projectState.error || profilesPerfState.error;

  let displayValues;

  if (!profilesPerfState.selectedId) {
    displayValues = analysisDisplayValues(
      bestEstimatedState,
      modelAnalysisBatchSize,
      modelAnalysisNodeSummaries,
      modelAnalysisNodeResults
    );
  } else if (profilePerf) {
    displayValues = profilePerfDisplayValues(
      profilePerf,
      bestEstimatedState,
      profilePerfNodeSummaries,
      profilePerfNodeResults
    );
  } else {
    displayValues = baselineDisplayValues();
  }

  return (
    <ScrollerLayout layoutClass={classes.root}>
      <LoaderLayout
        status={overallStatus}
        error={overallError}
        errorComponent={
          <GenericPage
            title="Error Retrieving Performance Profile"
            description={overallError}
            logoComponent={<SentimentVeryDissatisfiedIcon />}
          />
        }
        rootClass={overallError ? "" : classes.body}
        loaderClass={classes.loader}
      >
        <div className={classes.layout}>
          <PerfProfileCreateDialog
            open={modalsState.perfModalOpen || false}
            handleClose={() => dispatch(setPerfModalOpen(false))}
            projectId={projectId}
          />
          <div className={classes.title}>
            <Typography color="textSecondary" variant="h5">
              Performance Profile{" "}
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              className={classes.titleExtras}
            >
              {displayValues.extras}
            </Typography>
          </div>
          <ProfileSummaryCard
            status={bestEstimatedState.status}
            error={bestEstimatedState.error}
            projectId={projectState.projectId}
            name={displayValues.name}
            profileDescriptorsOne={[
              {
                title: "Batch Size",
                value: displayValues.batchSize,
              },
              {
                title: "Core Count",
                value: displayValues.coreCount,
              },
            ]}
            profileDescriptorsTwo={[
              {
                title: "Instruction Sets",
                value: displayValues.instructionSets,
              },
            ]}
            metricOne={displayValues.metricOne}
            metricTwo={displayValues.metricTwo}
            metricThree={displayValues.metricThree}
            metricFour={displayValues.metricFour}
            expectedOptimizeText={displayValues.expectedOptimizationText}
          />
          <div className={classes.spacer} />

          <Typography color="textSecondary" variant="h5" className={classes.title}>
            Layer Summaries
          </Typography>
          <ChartSummariesCard
            plotType="bar"
            summaries={displayValues.analysisSummaries}
            xAxisTitle="Layer Type"
            tooltipValues={[{ key: "label", display: "Layer Type" }]}
          />
          <div className={classes.spacer} />

          <Typography color="textSecondary" variant="h5" className={classes.title}>
            Layer Results
          </Typography>
          <ChartSummariesCard
            plotType="line"
            summaries={displayValues.analysisResults}
            xAxisTitle="Layer Depth"
            tooltipValues={[
              { key: "label", display: "Layer Depth" },
              { key: "id", display: "Layer ID" },
              { key: "opType", display: "Layer Type" },
              { key: "weightName", display: "Weight Name" },
            ]}
          />
          <div className={classes.spacer} />
        </div>
      </LoaderLayout>
    </ScrollerLayout>
  );
}

export default ProjectPerf;
