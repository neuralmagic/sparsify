import { useState } from "react";

function createStateDict(
  values,
  setValues,
  origValues,
  setOrigValues,
  saveValues,
  setSaveValues,
  saveOptions,
  setSaveOptions
) {
  function separateArgs(update) {
    const rootValues = {};
    const args = {};

    Object.keys(update).forEach((key) => {
      if (["clazz", "start_epoch", "end_epoch", "init_lr"].indexOf(key) > -1) {
        rootValues[key] = update[key];
      } else {
        args[key] = update[key];
      }
    });

    return { rootValues, args };
  }

  return {
    current: {
      val: values,
      setter: (update, clearArgs = false) => {
        const { rootValues, args } = separateArgs(update);
        const updated = { ...values, ...rootValues };
        updated.args = clearArgs ? args : { ...updated.args, ...args };
        setValues(updated);
        return updated;
      },
    },
    orig: {
      val: origValues,
      setter: (update, clearArgs = false) => {
        const { rootValues, args } = separateArgs(update);
        const updated = { ...origValues, ...rootValues };
        updated.args = clearArgs ? args : { ...updated.args, ...args };
        setOrigValues(updated);
        return updated;
      },
    },
    save: {
      val: saveValues,
      setter: (update, clearArgs = false) => {
        const { rootValues, args } = separateArgs(update);
        const updated = { ...saveValues, ...rootValues };
        updated.args = clearArgs ? args : { ...updated.args, ...args };
        setSaveValues(updated);
        return updated;
      },
    },
    saveOptions: {
      val: saveOptions,
      setter: (dirty) => {
        const updated = { dirty };
        setSaveOptions(updated);
        return updated;
      },
    },
  };
}

function changeLRModUpdateState(newVals, stateDict, original) {
  if (newVals.hasOwnProperty("clazz")) {
    if (newVals.clazz === "step") {
      newVals["step_size"] = stateDict.current.val.args.hasOwnProperty("step_size")
        ? stateDict.current.val.args.step_size
        : "1.0";
    }

    if (newVals.clazz === "multi_step") {
      const start_epochEpoch = stateDict.save.val.start_epoch
        ? stateDict.save.val.start_epoch
        : 0;
      newVals["milestones"] = stateDict.current.val.args.hasOwnProperty("milestones")
        ? stateDict.current.val.args.milestones
        : `${start_epochEpoch + 1}, ${start_epochEpoch + 2}`;
    }

    if (
      newVals.clazz === "step" ||
      newVals.clazz === "multi_step" ||
      newVals.clazz === "exponential"
    ) {
      newVals["gamma"] = stateDict.current.val.args.hasOwnProperty("gamma")
        ? stateDict.current.val.args.gamma
        : "0.9";
    }
  }

  Object.keys(newVals).forEach((key) => {
    const value = newVals[key];
    if (value === null || value === undefined) {
      newVals[key] = "";
    } else {
      newVals[key] = `${value}`;
    }
  });

  const values = stateDict.current.setter(newVals, original);
  const origValues = original
    ? stateDict.orig.setter(newVals, true)
    : stateDict.orig.val;

  Object.keys(newVals).forEach((key) => {
    if (key !== "clazz" && key !== "milestones") {
      const value = newVals[key];
      newVals[key] = parseFloat(value);

      if (key === "start_epoch" && isNaN(newVals[key])) {
        newVals[key] = 0;
      }

      if (
        key === "end_epoch" &&
        (isNaN(newVals[key]) || newVals[key] < stateDict.save.val.start_epoch)
      ) {
        newVals[key] = -1;
      }

      if (
        key === "init_lr" &&
        (isNaN(newVals[key]) || newVals[key] < 0 || newVals[key] > 1)
      ) {
        newVals[key] = 0.0;
      }

      if (key === "step_size" && (isNaN(newVals[key]) || newVals[key] < 0)) {
        newVals[key] = 1.0;
      }

      if (
        key === "gamma" &&
        (isNaN(newVals[key]) || newVals[key] <= 0 || newVals[key] > 1.0)
      ) {
        newVals[key] = 0.9;
      }
    } else if (key === "milestones") {
      let milestones = newVals.milestones ? newVals.milestones.split(",") : [];
      for (let index = 0; index < milestones.length; index++) {
        let milestone = parseFloat(milestones[index]);

        if (isNaN(milestone) || milestone < stateDict.save.val.start_epoch) {
          milestone = stateDict.save.val.start_epoch;
        }

        milestones[index] = milestone;
      }
      newVals.milestones = milestones;
    }
  });
  const saveValues = stateDict.save.setter(newVals, original);

  let dirty = false;
  Object.keys(origValues).forEach((key) => {
    if (key !== "args") {
      dirty = dirty || values[key] !== origValues[key];
    } else {
      Object.keys(origValues.args).forEach((argKey) => {
        dirty = dirty || values.args[argKey] !== origValues.args[argKey];
      });
    }
  });

  stateDict.saveOptions.setter(dirty);
}

function useLRModState(lrMod) {
  const formattedArgs = {};
  Object.keys(lrMod.args).forEach((key) => {
    formattedArgs[key] =
      lrMod.args[key] || lrMod.args[key] === 0 ? `${lrMod.args[key]}` : "";
  });
  const formattedLRMod = {
    clazz: lrMod.clazz,
    start_epoch:
      lrMod.start_epoch || lrMod.start_epoch === 0 ? `${lrMod.start_epoch}` : "",
    end_epoch: lrMod.end_epoch || lrMod.end_epoch === 0 ? `${lrMod.end_epoch}` : "",
    init_lr: lrMod.init_lr || lrMod.init_lr === 0 ? `${lrMod.init_lr}` : "",
    args: formattedArgs,
  };

  const [values, setValues] = useState({ ...formattedLRMod });
  const [origValues, setOrigValues] = useState({ ...formattedLRMod });
  const [saveValues, setSaveValues] = useState({
    clazz: lrMod.clazz,
    start_epoch: lrMod.start_epoch,
    end_epoch: lrMod.end_epoch,
    init_lr: lrMod.init_lr,
    args: lrMod.args,
  });
  const [saveOptions, setSaveOptions] = useState({
    dirty: false,
  });
  const stateDict = createStateDict(
    values,
    setValues,
    origValues,
    setOrigValues,
    saveValues,
    setSaveValues,
    saveOptions,
    setSaveOptions
  );

  function changeValue(key, value) {
    const original = false;
    changeLRModUpdateState({ [`${key}`]: value }, stateDict, original);
  }

  function clearChanged() {
    const original = true;
    const origVal = {};
    Object.keys(stateDict.orig.val).forEach((key) => {
      if (key !== "args") {
        origVal[key] = stateDict.orig.val[key];
      } else {
        Object.keys(stateDict.orig.val.args).forEach((argKey) => {
          origVal[argKey] = stateDict.orig.val.args[argKey];
        });
      }
    });
    changeLRModUpdateState({ ...origVal }, stateDict, original);
  }

  function saveChanged() {
    const original = true;
    const saveVal = {};
    Object.keys(stateDict.save.val).forEach((key) => {
      if (key !== "args") {
        saveVal[key] =
          stateDict.save.val[key] || stateDict.save.val[key] === 0
            ? `${stateDict.save.val[key]}`
            : "";
      } else {
        Object.keys(stateDict.orig.val.args).forEach((argKey) => {
          saveVal[argKey] =
            stateDict.save.val.args[argKey] || stateDict.save.val.args[argKey] === 0
              ? `${stateDict.save.val.args[argKey]}`
              : "";
        });
      }
    });
    changeLRModUpdateState({ ...saveVal }, stateDict, original);
  }

  return {
    changeValue,
    clearChanged,
    saveChanged,
    values,
    saveValues,
    saveOptions,
  };
}

export default useLRModState;
