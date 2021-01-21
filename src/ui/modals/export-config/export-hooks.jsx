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
} from "../../store";

export const useExportEffects = (
  dispatch,
  projectId,
  optimId,
  frameworkTab,
  sampleType,
  open
) => {
  const selectedOptimsState = useSelector(selectSelectedOptimsState);
  const configState = useSelector(selectSelectedConfigState);

  const { availableFrameworks } = configState;

  useEffect(() => {
    dispatch(getAvailableFrameworksThunk({ projectId }));
  }, [dispatch, projectId, open]);

  useEffect(() => {
    if (open) {
      availableFrameworks.forEach((framework) => {
        dispatch(getAvailableCodeSamplesThunk({ projectId, framework }));
      });
    }
  }, [dispatch, projectId, availableFrameworks, selectedOptimsState, open]);

  useEffect(() => {
    const framework = _.get(availableFrameworks, frameworkTab);
    if (framework && open) {
      dispatch(
        getConfigThunk({
          projectId,
          optimId,
          framework,
        })
      );
    }
  }, [dispatch, projectId, optimId, availableFrameworks, frameworkTab, open]);

  useEffect(() => {
    const framework = _.get(availableFrameworks, frameworkTab);
    if (framework && sampleType !== "" && open) {
      dispatch(
        getCodeSampleThunk({
          projectId,
          framework,
          sampleType,
        })
      );
    }
  }, [dispatch, projectId, availableFrameworks, frameworkTab, sampleType, open]);
};
