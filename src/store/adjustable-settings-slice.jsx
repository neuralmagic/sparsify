import {
  compose,
  mergeDeepRight,
  indexBy,
  flatten,
  prop,
  pick,
  map,
  curry,
  path,
  merge,
  reject,
  isNil,
  defaultTo,
  values,
  omit,
} from "ramda";
import { createSlice } from "@reduxjs/toolkit";
import { getOptimsThunk, changeModifierSettingsThunk } from "./optims-slice";

import { all, takeLatest, delay, select, put } from "redux-saga/effects";

const modifierAdjustableSettings = [
  "sparsity",
  "end_epoch",
  "start_epoch",
  "update_frequency",
  "balance_perf_loss",
  "filter_min_sparsity",
  "filter_min_perf_gain",
  "filter_max_loss_drop",
];

const layerAdjustableSettings = ["sparsity"];

const optimIdentifiers = ["project_id", "optim_id"];

const modifierIdentifiers = ["project_id", "optim_id", "modifier_id"];

const getLayerAdjustableSettingsFromOptims = compose(
  indexBy(prop("modifier_id")),
  flatten,
  map((modifier) =>
    compose(
      merge({ modifier_id: modifier.modifier_id }),
      indexBy(prop("node_id")),
      map(
        compose(
          merge(pick(modifierIdentifiers, modifier)),
          pick(["node_id", ...layerAdjustableSettings])
        )
      )
    )(modifier.nodes)
  ),
  flatten,
  map((optim) => map(merge(pick(optimIdentifiers, optim)), optim.pruning_modifiers))
);

/**
 * Slice for handling adjustable settings for entities in the redux store.
 */
const adjustableSettingsSlice = createSlice({
  name: "adjustableSettings",
  initialState: {
    val: {
      modifiers: {},
    },
  },
  reducers: {
    changeModifierAdjustableSettings: (state, action) => {
      const { modifierId, settings } = action.payload;

      state.val.modifiers[modifierId] = merge(
        state.val.modifiers[modifierId],
        settings
      );
    },
    changeLayerAdjustableSettings: (state, action) => {
      const { modifierId, layerId, settings } = action.payload;

      state.val.layers[modifierId][layerId] = merge(
        state.val.layers[modifierId][layerId],
        settings
      );
    },
  },
  extraReducers: {
    [getOptimsThunk.fulfilled]: (state, action) => {
      const modifierSettings = compose(
        indexBy(prop("modifier_id")),
        map(pick([...modifierIdentifiers, ...modifierAdjustableSettings])),
        flatten,
        map((optim) =>
          map(merge(pick(optimIdentifiers, optim)), optim.pruning_modifiers)
        )
      )(action.payload);

      const layerSettings = getLayerAdjustableSettingsFromOptims(action.payload);

      state.val.modifiers = mergeDeepRight(state.val.modifiers, modifierSettings);
      state.val.layers = mergeDeepRight(state.val.layers, layerSettings);
    },
    [changeModifierSettingsThunk.fulfilled]: (state, action) => {
      const layerSettings = getLayerAdjustableSettingsFromOptims([action.payload]);

      state.val.layers = mergeDeepRight(state.val.layers, layerSettings);
    },
  },
});

function* changeModifierAdjustableSettingSaga({ payload }) {
  yield delay(1500);

  const modifierSettings = yield select(
    selectModifierAdjustableSettings(payload.modifierId)
  );
  const data = {
    projectId: modifierSettings.project_id,
    optimId: modifierSettings.optim_id,
    modifierId: modifierSettings.modifier_id,
    settings: compose(
      reject(isNil),
      pick(modifierAdjustableSettings)
    )(modifierSettings),
  };

  yield put(changeModifierSettingsThunk(data));
}

function* changeLayerAdjustableSettingsSaga({ payload }) {
  yield delay(1000);

  const layerSettings = yield select(
    selectLayerAdjustableSettings(payload.modifierId, payload.layerId)
  );
  const allLayers = yield select(selectAllLayersAdjustableSettings(payload.modifierId))
  const nodes = compose(
    map(pick(["node_id", ...layerAdjustableSettings])),
    values,
    omit(['modifier_id']),
  )(allLayers)

  const data = {
    projectId: layerSettings.project_id,
    optimId: layerSettings.optim_id,
    modifierId: layerSettings.modifier_id,
    settings: {
      nodes
    },
  };

  yield put(changeModifierSettingsThunk(data));
}

/***
 * Available actions for adjustableSettings redux store
 */
export const {
  changeModifierAdjustableSettings,
  changeLayerAdjustableSettings,
} = adjustableSettingsSlice.actions;

export function* sagas() {
  yield all([
    takeLatest(changeModifierAdjustableSettings, changeModifierAdjustableSettingSaga),
    takeLatest(changeLayerAdjustableSettings, changeLayerAdjustableSettingsSaga),
  ]);
}

/**
 * Simple selector to get the adjustable settings of a modifier
 *
 * @param state - the redux store state
 */
export const selectModifierAdjustableSettings = curry((modifierId, state) =>
  compose(
    defaultTo({}),
    path(["adjustableSettings", "val", "modifiers", modifierId])
  )(state)
);

export const selectAllLayersAdjustableSettings = curry((modifierId, state) =>
  compose(
    defaultTo({}),
    path(["adjustableSettings", "val", "layers", modifierId])
  )(state)
);

export const selectLayerAdjustableSettings = curry((modifierId, layerId, state) =>
  compose(
    defaultTo({}),
    prop(layerId),
    selectAllLayersAdjustableSettings(modifierId)
  )(state)
);

export default adjustableSettingsSlice.reducer;
