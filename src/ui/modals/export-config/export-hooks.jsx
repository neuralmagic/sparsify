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
