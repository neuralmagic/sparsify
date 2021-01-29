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

import { useState } from "react";

/**
 * Create a dictionary for managing all of the useState variables
 *
 * @param values - useState values
 * @param setValues - useState setValues
 * @param origValues - useState origValues
 * @param setOrigValues - useState setOrigValues
 * @param saveValues - useState saveValues
 * @param setSaveValues - useSate setSaveValues
 * @param valErrors - useState valErrors
 * @param setValErrors - useState setValErrors
 * @param saveOptions - useState saveOptions
 * @param setSaveOptions - useState setSaveOptions
 * @returns {{
 *   saveOptions: {val: *, setter: (function(*, *): {dirty: *, errored: *})},
 *   current: {val: *, setter: (function(*): *)},
 *   valErrors: {val: *, setter: (function(*): *)},
 *   orig: {val: *, setter: (function(*): *)},
 *   save: {val: *, setter: (function(*): *)}
 * }}
 */
function createStateDict(
  values,
  setValues,
  origValues,
  setOrigValues,
  saveValues,
  setSaveValues,
  valErrors,
  setValErrors,
  saveOptions,
  setSaveOptions
) {
  return {
    current: {
      val: values,
      setter: (update) => {
        const updated = { ...values, ...update };
        setValues(updated);
        return updated;
      },
    },
    orig: {
      val: origValues,
      setter: (update) => {
        const updated = { ...origValues, ...update };
        setOrigValues(updated);
        return updated;
      },
    },
    save: {
      val: saveValues,
      setter: (update) => {
        const updated = { ...saveValues, ...update };
        setSaveValues(updated);
        return updated;
      },
    },
    valErrors: {
      val: valErrors,
      setter: (update) => {
        const updated = { ...valErrors, ...update };
        setValErrors(updated);
        return updated;
      },
    },
    saveOptions: {
      val: saveOptions,
      setter: (dirty, errored) => {
        const updated = { dirty, errored };
        setSaveOptions(updated);
        return updated;
      },
    },
  };
}

/**
 * Given a collection of new values, update the current project's update state with React's useState
 *
 * @param newVals - the new values to update the state with
 * @param stateDict - the state dict as given by createStateDict
 * @param original - True if newVals should be treated as the original values, False for new ones
 */
function changeProjectUpdateState(newVals, stateDict, original) {
  Object.keys(newVals).forEach((key) => {
    const value = newVals[key];
    if (value === null || value === undefined) {
      newVals[key] = "";
    } else {
      newVals[key] = `${value}`;
    }
  });

  const values = stateDict.current.setter(newVals);
  const origValues = original ? stateDict.orig.setter(newVals) : stateDict.orig.val;

  const newErrors = {};
  Object.keys(newVals).forEach((key) => {
    if (["trainingEpochs", "trainingLRInit", "trainingLRFinal"].includes(key)) {
      const value = newVals[key];
      const valueNumeric = value !== "" ? parseFloat(value) : null;
      newVals[key] = valueNumeric;
      newErrors[key] = isNaN(valueNumeric) ? "Must be a valid number" : null;
    } else {
      newErrors[key] = null;
    }
  });
  const valErrors = stateDict.valErrors.setter(newErrors);
  const saveValues = stateDict.save.setter(newVals);

  let dirty = false;
  Object.keys(origValues).forEach((key) => {
    dirty = dirty || values[key] !== origValues[key];
  });

  let errored = false;
  Object.keys(valErrors).forEach((key) => {
    errored = errored || !!valErrors[key];
  });

  stateDict.saveOptions.setter(dirty, errored);
}

/**
 * Hook for managing the state of updating a project.
 * Handles updating values state, validation, and save checking.
 * Additionally returns callbacks to enable updating the state.
 *
 * @param projectId - id of the project to create the state for
 * @returns {{
 *   changeValue: changeValue,
 *   projectLoaded: projectLoaded,
 *   projectSaving: projectSaving,
 *   values: {
 *     trainingEpochs: string, name: string, description: string, projectId: null,
 *     trainingOptimizer: string, trainingLRInit: string, trainingLRFinal: string
 *   },
 *   saveValues: {
 *     trainingEpochs: null, name: null, description: null, trainingOptimizer: null,
 *     trainingLRInit: null, trainingLRFinal: null
 *   },
 *   validationErrors: {
 *     trainingEpochs: null, name: null, description: null, trainingOptimizer: null,
 *     trainingLRInit: null, trainingLRFinal: null
 *   },
 *   saveOptions: {dirty: boolean, errored: boolean},
 * }}
 */
function useProjectUpdateState(projectId) {
  const [values, setValues] = useState({
    projectId: null,
    name: "",
    description: "",
    trainingOptimizer: "",
    trainingEpochs: "",
    trainingLRInit: "",
    trainingLRFinal: "",
  });
  const [origValues, setOrigValues] = useState({
    projectId: null,
    name: "",
    description: "",
    trainingOptimizer: "",
    trainingEpochs: "",
    trainingLRInit: "",
    trainingLRFinal: "",
  });
  const [saveValues, setSaveValues] = useState({
    name: null,
    description: null,
    trainingOptimizer: null,
    trainingEpochs: null,
    trainingLRInit: null,
    trainingLRFinal: null,
  });
  const [valErrors, setValErrors] = useState({
    name: null,
    description: null,
    trainingOptimizer: null,
    trainingEpochs: null,
    trainingLRInit: null,
    trainingLRFinal: null,
  });
  const [saveOptions, setSaveOptions] = useState({
    dirty: false,
    errored: false,
  });
  const stateDict = createStateDict(
    values,
    setValues,
    origValues,
    setOrigValues,
    saveValues,
    setSaveValues,
    valErrors,
    setValErrors,
    saveOptions,
    setSaveOptions
  );

  const changeValue = (key, value) => {
    const original = false;
    changeProjectUpdateState({ [`${key}`]: value }, stateDict, original);
  };

  const projectLoaded = (project) => {
    const original = true;
    changeProjectUpdateState(
      {
        projectId: project.project_id,
        name: project.name,
        description: project.description,
        trainingOptimizer: project.training_optimizer,
        trainingEpochs: project.training_epochs,
        trainingLRInit: project.training_lr_init,
        trainingLRFinal: project.training_lr_final,
      },
      stateDict,
      original
    );
  };

  const projectSaving = () => {
    const original = true;
    changeProjectUpdateState({ projectId: null }, stateDict, original);
  };

  return {
    changeValue,
    projectLoaded,
    projectSaving,
    values,
    saveValues,
    validationErrors: valErrors,
    saveOptions,
  };
}

export default useProjectUpdateState;
