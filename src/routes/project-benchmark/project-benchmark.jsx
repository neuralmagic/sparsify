import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import BenchmarkCreateDialog from "./../../modals/benchmark-create";
import {
  getBenchmarksThunk,
  selectBenchmarks,
  selectCreatedBenchmark,
  setCreatedBenchmarkThunk,
  STATUS_SUCCEEDED,
  STATUS_LOADING,
} from "../../store";

import AbsoluteLayout from "../../components/absolute-layout";
import BenchmarkCard from "./benchmark-card";
import ScrollerLayout from "../../components/scroller-layout";
import makeStyles from "./project-benchmark-styles";
import { Fab } from "@material-ui/core";
import { JOB_CANCELED, JOB_COMPLETED, JOB_ERROR } from "../../api";

const useStyles = makeStyles();

function ProjectBenchmark({ match }) {
  const projectId = _.get(match, "params.projectId");
  const classes = useStyles();
  const dispatch = useDispatch();
  const benchmarksState = useSelector(selectBenchmarks);
  const createdBenchmarkState = useSelector(selectCreatedBenchmark);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    dispatch(getBenchmarksThunk({ projectId }));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (
      benchmarksState.status === STATUS_SUCCEEDED &&
      createdBenchmarkState.status !== STATUS_LOADING
    ) {
      const benchmarksInProgress = benchmarksState.val.filter((benchmark) => {
        const jobStatus = _.get(benchmark, "job.status");
        return (
          jobStatus !== JOB_COMPLETED &&
          jobStatus !== JOB_CANCELED &&
          jobStatus !== JOB_ERROR
        );
      });
      benchmarksInProgress.sort((a, b) => new Date(a.created) - new Date(b.created));

      if (benchmarksInProgress.length > 0) {
        dispatch(
          setCreatedBenchmarkThunk({
            projectId,
            benchmark: benchmarksInProgress[0],
          })
        );
      }
    }
  }, [dispatch, benchmarksState, createdBenchmarkState.status, projectId]);

  return (
    <AbsoluteLayout>
      <ScrollerLayout layoutClass={classes.root}>
        <div className={classes.body}>
          {benchmarksState.val.map((benchmark) => (
            <BenchmarkCard
              key={benchmark.benchmark_id}
              benchmark={benchmark}
              projectId={projectId}
            />
          ))}
          <BenchmarkCreateDialog
            open={openCreate}
            handleClose={() => setOpenCreate(false)}
            projectId={projectId}
          />
          <Fab
            variant="extended"
            color="secondary"
            arial-label="Add Benchmark"
            className={classes.fab}
            onClick={() => setOpenCreate(true)}
          >
            Add Benchmark
          </Fab>
        </div>
      </ScrollerLayout>
    </AbsoluteLayout>
  );
}

export default ProjectBenchmark;
