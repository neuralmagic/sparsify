import { useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import {
  getAvailableFrameworksThunk,
  getConfigThunk,
  getAvailableCodeSamplesThunk,
  selectSelectedConfigState,
  selectSelectedOptimsState,
  getCodeSampleThunk,
  STATUS_LOADING,
  STATUS_IDLE,
  STATUS_SUCCEEDED,
} from "../../store";

export const useExportEffects = (
  dispatch,
  projectId,
  optimId,
  frameworkTab,
  sampleType
) => {
  const selectedOptimsState = useSelector(selectSelectedOptimsState);
  const configState = useSelector(selectSelectedConfigState);

  const { availableFrameworks } = configState;

  useEffect(() => {
    dispatch(getAvailableFrameworksThunk({ projectId }));
  }, [dispatch, projectId]);

  useEffect(() => {
    availableFrameworks.forEach((framework) => {
      dispatch(getAvailableCodeSamplesThunk({ projectId, framework }));
    });
  }, [dispatch, projectId, availableFrameworks, selectedOptimsState]);

  useEffect(() => {
    const framework = _.get(availableFrameworks, frameworkTab);
    if (framework) {
      dispatch(
        getConfigThunk({
          projectId,
          optimId,
          framework,
        })
      );
    }
  }, [dispatch, projectId, optimId, availableFrameworks, frameworkTab]);

  useEffect(() => {
    const framework = _.get(availableFrameworks, frameworkTab);
    if (framework && sampleType !== "") {
      dispatch(
        getCodeSampleThunk({
          projectId,
          framework,
          sampleType,
        })
      );
    }
  }, [
    dispatch,
    projectId,
    availableFrameworks,
    frameworkTab,
    sampleType,
  ]);
};
