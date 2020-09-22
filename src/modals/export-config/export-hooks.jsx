import { useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import {
  getAvailableFrameworksThunk,
  getConfigThunk,
  getAvailableCodeSamplesThunk,
  selectSelectedConfigState,
  getCodeSampleThunk,
} from "../../store";

export const useExportEffects = (
  dispatch,
  projectId,
  optimId,
  frameworkTab,
  sampleType
) => {
  const configState = useSelector(selectSelectedConfigState);

  const { availableFrameworks, availableCodeSamples, config } = configState;

  useEffect(() => {
    dispatch(getAvailableFrameworksThunk({ projectId }));
  }, [dispatch, projectId]);

  useEffect(() => {
    availableFrameworks.forEach((framework) => {
      dispatch(getAvailableCodeSamplesThunk({ projectId, framework }));
    });
  }, [dispatch, projectId, availableFrameworks]);

  useEffect(() => {
    const framework = _.get(availableFrameworks, frameworkTab);
    if (framework && !(framework in config)) {
      dispatch(
        getConfigThunk({
          projectId,
          optimId,
          framework,
        })
      );
    }
  }, [dispatch, projectId, optimId, availableFrameworks, frameworkTab, config]);

  useEffect(() => {
    const framework = _.get(availableFrameworks, frameworkTab);
    const codeSample = _.get(availableCodeSamples, `${framework}.${sampleType}`);
    if (framework && sampleType !== "" && !codeSample) {
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
    availableCodeSamples,
    frameworkTab,
    sampleType,
  ]);
};
