export const allProfiles = state => state.profiles.all
export const selectedProfile = state => state.profiles.all.find(p => p.id === state.profiles.selected)