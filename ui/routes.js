import { compose, isNil, prop } from 'ramda'
import { useRoute, useRedirect } from './common/router'

export const redirectToRootIfNoSelectedProject = useRedirect('/', compose(isNil, prop('selectedProject')))

export const onlyOnRootPage = useRoute('/')
export const onlyOnProjectPage = useRoute('/project/:selectedProjectId/:selectedSection')
export const onlyOnProjectOptimization = useRoute('/project/:selectedProjectId/optimization')
