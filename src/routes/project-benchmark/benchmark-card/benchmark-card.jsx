import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card, Button } from "@material-ui/core";
import moment from "moment";
import _ from "lodash";

import {
  getBenchmarksThunk,
  deleteBenchmarkThunk,
  selectCreatedBenchmark,
  selectCreatedBenchmarkId,
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
import { JOB_CANCELED } from "../../../api";
import FadeTransitionGroup from "../../../components/delayed-fade-transition-group";

const useStyles = makeStyles();

function BenchmarkCard({ benchmark, projectId }) {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const createdBenchmarkId = useSelector(selectCreatedBenchmarkId);
  const createdBenchmarkState = useSelector(selectCreatedBenchmark);
  const classes = useStyles();
  const date = moment.utc(benchmark.created).local();

  let loading,
    progress = null;

  if (createdBenchmarkId === benchmark.benchmark_id || deleting) {
    loading =
      createdBenchmarkState.status === STATUS_LOADING ||
      createdBenchmarkState.status === STATUS_FAILED ||
      (deleting && createdBenchmarkState.cancelStatus === STATUS_LOADING);
    progress = createdBenchmarkState.progressValue;
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

  const inferenceEngineToName = (engine) => {
    if (engine === "ort_cpu") {
      return "ONNX Runtime CPU";
    } else if (engine === "neural_magic") {
      return "Neural Magic";
    }
  };

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

  let benchmarkType = "baseline";
  if (
    _.get(benchmark, "core_counts.length", 0) > 1 ||
    _.get(benchmark, "batch_sizes.length", 0) > 1
  ) {
    benchmarkType = "scaling";
  } else if (_.get(benchmark, "inference_models.length", 0) > 1) {
    benchmarkType = "comparison";
  }

  const batchSizes = [..._.get(benchmark, "batch_sizes", [])];
  batchSizes.sort((a, b) => Number(a) - Number(b));

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
        <div className={classes.title}>
          <Typography className={classes.headerName} color="textPrimary" variant="h5">
            {name || "Unspecified"}
          </Typography>
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
                <Button
                  disabled={createdBenchmarkState.cancelStatus === STATUS_LOADING}
                  onClick={handleDelete}
                >
                  {errorLabel}
                </Button>
              )}
            </div>
            <div className={classes.cardContainer}>
              {benchmarkType === "baseline" && (
                <BenchmarkBaseline benchmark={benchmark} handleDelete={handleDelete} />
              )}
              {benchmarkType === "comparison" && (
                <BenchmarkComparison
                  benchmark={benchmark}
                  handleDelete={handleDelete}
                />
              )}
              {benchmarkType === "scaling" && (
                <BenchmarkScaling benchmark={benchmark} handleDelete={handleDelete} />
              )}
            </div>
          </FadeTransitionGroup>
        </Card>
      </div>
    </GrowTransitions>
  );
}

export default BenchmarkCard;
