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
  isNil
} from 'ramda';
import { createSlice } from '@reduxjs/toolkit'
import { getOptimsThunk, changeModifierSettingsThunk } from './optims-slice'

import { all, takeLatest, delay, select, put } from 'redux-saga/effects'

const modifierAdjustableSettings = [
  'sparsity',
  'end_epoch',
  'start_epoch',
  'update_frequency',
  'balance_perf_loss',
  'filter_min_sparsity',
  'filter_min_perf_gain',
  'filter_max_loss_drop'
]

/**
 * Slice for handling adjustable settings for entities in the redux store.
 */
const adjustableSettingsSlice = createSlice({
  name: 'adjustableSettings',
  initialState: {
    val: {
      modifiers: {}
    }
  },
  reducers: {
    changeModifierAdjustableSettings: (state, action) => {
      const { modifierId, settings } = action.payload

      state.val.modifiers[modifierId] = merge(state.val.modifiers[modifierId], settings)
    }
  },
  extraReducers: {
    [getOptimsThunk.fulfilled]: (state, action) => {
      const modifierSettings = compose(
        indexBy(prop('modifier_id')),
        map(pick(['modifier_id', 'optim_id', 'project_id', ...modifierAdjustableSettings])),
        flatten,
        map(optim => map(merge(pick(['optim_id', 'project_id'], optim)), optim.pruning_modifiers)))(
        action.payload)

      state.val.modifiers = mergeDeepRight(state.val.modifiers, modifierSettings);
    },
  },
});

function* changeModifierAdjustableSettingSaga({ payload }) {
  yield delay(1500)

  const modifierSettings = yield select(selectModifierAdjustableSettings(payload.modifierId))
  const data = {
    projectId: modifierSettings.project_id,
    optimId: modifierSettings.optim_id,
    modifierId: modifierSettings.modifier_id,
    settings: compose(reject(isNil), pick(modifierAdjustableSettings))(modifierSettings)
  }

  yield put(changeModifierSettingsThunk(data))
}

/***
 * Available actions for adjustableSettings redux store
 */
export const {
  changeModifierAdjustableSettings
} = adjustableSettingsSlice.actions;

export function* sagas() {
  yield all([
    takeLatest(changeModifierAdjustableSettings, changeModifierAdjustableSettingSaga)
  ])
}

/**
 * Simple selector to get the adjustable settings of a modifier
 *
 * @param state - the redux store state
 */
export const selectModifierAdjustableSettings = curry((modifierId, state) =>
  path(['adjustableSettings', 'val', 'modifiers', modifierId])(state))

export default adjustableSettingsSlice.reducer;

