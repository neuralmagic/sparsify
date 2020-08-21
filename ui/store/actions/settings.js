export const updateProjectSettings = settings => dispatch =>
  dispatch({ type: 'UPDATE_PROJECT_SETTINGS', settings })

export const discardProjectSettingsDialog = () => dispatch =>
  dispatch({ type: 'UPDATE_PROJECT_SETTINGS_DISCARDED', discarded: true })
