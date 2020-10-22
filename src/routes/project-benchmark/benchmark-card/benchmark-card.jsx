import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card, Button, Grid } from "@material-ui/core";
import _ from "lodash";

import {
  getBenchmarksThunk,
  createBenchmarkCopyThunk,
  deleteBenchmarkThunk,
  selectCreatedBenchmark,
  selectSelectedOptimsState,
  STATUS_FAILED,
  STATUS_LOADING,
  STATUS_SUCCEEDED,
} from "../../../store";

import BenchmarkBaseline from "../benchmark-baseline";
import BenchmarkComparison from "../benchmark-comparison";
import BenchmarkScaling from "../benchmark-scaling";
import GrowTransitions from "../../../components/grow-transition";

import makeStyles from "./benchmark-card-styles";
import LoaderLayout from "../../../components/loader-layout";
import { JOB_CANCELED, JOB_COMPLETED, JOB_PENDING, JOB_STARTED } from "../../../api";
import FadeTransitionGroup from "../../../components/delayed-fade-transition-group";
import {
  dateUtcToLocal,
  dateUtcToLocalString,
  inferenceEngineToName,
} from "../../../components";
import { Link } from "react-router-dom";
import { createProjectOptimPath } from "../../paths";

const useStyles = makeStyles();

function BenchmarkCardHeader({ benchmark }) {
  const classes = useStyles();
  const date = dateUtcToLocal(benchmark.created);
  const optimsState = useSelector(selectSelectedOptimsState);
  const { selectedProfileLossId, selectedProfilePerfId } = optimsState;

  const batchSizes = [..._.get(benchmark, "batch_sizes", [])];
  batchSizes.sort((a, b) => Number(a) - Number(b));

  const optimName = (optimId) => {
    const optim = _.get(optimsState, "val", []).find(
      (optim) => optim.optim_id === optimId
    );
    if (optim) {
      return dateUtcToLocalString(optim.created);
    } else {
      return optimId.slice(0, 20);
    }
  };

  const hasOptimization = benchmark.inference_models.reduce(
    (accum, model) => accum || model.inference_model_optimization !== "",
    false
  );

  return (
    <div className={classes.title}>
      <Grid direction="row" container spacing={1} className={classes.headerName}>
        {benchmark.inference_models.map((model, index) => (
          <Grid
            container
            item
            key={index}
            spacing={1}
            alignItems="baseline"
            className={classes.headerNameGroup}
          >
            {index !== 0 && (
              <Grid item className={classes.headerNameGroup}>
                <Typography variant="h6" color="textSecondary">
                  vs
                </Typography>
              </Grid>
            )}
            <Grid direction="column" container item className={classes.headerNameGroup}>
              <Grid item>
                <Typography color="textPrimary" variant="h5">
                  {inferenceEngineToName(model.inference_engine)}
                </Typography>
              </Grid>
              <Grid item>
                {hasOptimization && (
                  <div>
                    <Typography color="textSecondary" variant="subtitle2">
                      {model.inference_model_optimization
                        ? "Optimization: "
                        : "No Optimization"}
                      <Link
                        className={classes.optimLink}
                        to={createProjectOptimPath(
                          benchmark.project_id,
                          model.inference_model_optimization,
                          selectedProfilePerfId,
                          selectedProfileLossId
                        )}
                      >
                        {optimName(model.inference_model_optimization)}
                      </Link>
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Typography
        className={classes.headerDate}
        color="textSecondary"
        variant="subtitle1"
      >
        {`(${date.fromNow()})`}
      </Typography>
      <div className={classes.headerGroup}>
        <Typography
          color="textSecondary"
          variant="caption"
          className={classes.headerLabel}
        >
          Batch Size
        </Typography>
        <Typography color="textPrimary" variant="subtitle1">
          {batchSizes.join(", ")}
        </Typography>
      </div>
      <div className={classes.headerGroup}>
        <Typography
          color="textSecondary"
          variant="caption"
          className={classes.headerLabel}
        >
          Core Count
        </Typography>
        <Typography color="textPrimary" variant="subtitle1">
          {benchmark.core_counts.join(", ")}
        </Typography>
      </div>
      <div className={classes.headerGroup}>
        <Typography
          color="textSecondary"
          variant="caption"
          className={classes.headerLabel}
        >
          Instruction Set
        </Typography>
        <Typography color="textPrimary" variant="subtitle1">
          {benchmark.instruction_sets.join(", ")}
        </Typography>
      </div>
    </div>
  );
}

function BenchmarkCard({ benchmark, projectId }) {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const createdBenchmarkState = useSelector(selectCreatedBenchmark);
  const classes = useStyles();

  let loading,
    progress = null;

  const jobStatus = _.get(benchmark, "job.status");
  const inProgress = benchmark.source !== "uploaded" && jobStatus !== JOB_COMPLETED;

  loading = inProgress || deleting;

  if (loading) {
    if (
      (jobStatus === JOB_STARTED ||
        _.get(createdBenchmarkState, "val.benchmark_id") === benchmark.benchmark_id) &&
      createdBenchmarkState.status === STATUS_LOADING
    ) {
      progress = createdBenchmarkState.progressValue;
    }
  }

  useEffect(() => {
    if (
      createdBenchmarkState.status === STATUS_SUCCEEDED ||
      createdBenchmarkState.cancelStatus === STATUS_SUCCEEDED ||
      createdBenchmarkState.cancelStatus === STATUS_FAILED
    ) {
      dispatch(getBenchmarksThunk({ projectId }));
    }
  }, [createdBenchmarkState, projectId, getBenchmarksThunk, dispatch]);

  let error = _.get(benchmark, "job.error");
  if (_.get(benchmark, "job.status") === JOB_CANCELED) {
    error = "Benchmark Canceled";
  }

  let label = loading && !error ? "Running Benchmark" : "";
  if (deleting) {
    label = "Deleting Benchmark";
  }

  const showLoader =
    error ||
    loading ||
    (deleting && createdBenchmarkState.cancelStatus === STATUS_SUCCEEDED);

  let errorLabel = error ? "Clear" : "Cancel";

  if (!showLoader) {
    errorLabel = "";
  }

  let name = benchmark.name;
  if (!name && benchmark.inference_models.length === 1) {
    name = inferenceEngineToName(benchmark.inference_models[0].inference_engine);
  } else if (!name && benchmark.inference_models.length > 1) {
    const names = benchmark.inference_models.map((model) =>
      inferenceEngineToName(model.inference_engine)
    );
    name = `${names[0]} vs. ${names[1]}`;
  }

  const handleDelete = () => {
    dispatch(
      deleteBenchmarkThunk({
        projectId,
        benchmarkId: benchmark.benchmark_id,
      })
    );
    setDeleting(true);
  };

  const handleRerun = () => {
    dispatch(
      createBenchmarkCopyThunk({
        benchmark,
      })
    );
  };

  let benchmarkType = "baseline";
  if (
    _.get(benchmark, "core_counts.length", 0) > 1 ||
    _.get(benchmark, "batch_sizes.length", 0) > 1
  ) {
    benchmarkType = "scaling";
  } else if (_.get(benchmark, "inference_models.length", 0) > 1) {
    benchmarkType = "comparison";
  }

  return (
    <GrowTransitions
      show={
        !deleting ||
        (deleting && createdBenchmarkState.cancelStatus !== STATUS_SUCCEEDED)
      }
      onEntered={() => {
        setAnimationEnded(true);
      }}
    >
      <div className={classes.layout}>
        <BenchmarkCardHeader benchmark={benchmark} />
        <Card className={classes.card} elevation={1}>
          <FadeTransitionGroup
            className={classes.transitionGroup}
            showIndex={showLoader || !animationEnded ? 0 : 1}
          >
            <div className={classes.loaderContainer}>
              <LoaderLayout
                loading={loading || !animationEnded}
                error={
                  createdBenchmarkState.cancelStatus === STATUS_LOADING ? "" : error
                }
                progress={!deleting ? progress : null}
                loaderSize={96}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.loaderText}
              >
                {label}
              </Typography>
              {(createdBenchmarkState.status !== STATUS_SUCCEEDED || error) && (
                <Button disabled={deleting} onClick={handleDelete}>
                  {errorLabel}
                </Button>
              )}
            </div>
            <div className={classes.cardContainer}>
              {benchmarkType === "baseline" && (
                <BenchmarkBaseline
                  benchmark={benchmark}
                  handleDelete={handleDelete}
                  handleRerun={handleRerun}
                />
              )}
              {benchmarkType === "comparison" && (
                <BenchmarkComparison
                  benchmark={benchmark}
                  handleDelete={handleDelete}
                  handleRerun={handleRerun}
                />
              )}
              {benchmarkType === "scaling" && (
                <BenchmarkScaling
                  benchmark={benchmark}
                  handleDelete={handleDelete}
                  handleRerun={handleRerun}
                />
              )}
            </div>
          </FadeTransitionGroup>
        </Card>
      </div>
    </GrowTransitions>
  );
}

BenchmarkCard.propTypes = {
  benchmark: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default BenchmarkCard;
