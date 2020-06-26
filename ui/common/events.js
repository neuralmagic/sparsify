import { compose, tap } from 'ramda'

const getEventTarget  = e => e.target
const getEventValue   = e => getEventTarget(e).value
const getEventKey     = e => e.key
const getEventKeyCode = e => e.keyCode || e.charCode

const preventDefault  = e => e.preventDefault()
const stopPropagation = e => e.stopPropagation()

const stopEvent = compose(
    tap(stopPropagation),
    tap(preventDefault))

const stopEventThen = next => compose(
    next,
    stopEvent)

const path = e => e.path || e.composedPath && e.composedPath()

export {
  getEventTarget,
  getEventValue,
  preventDefault,
  stopPropagation,
  stopEvent,
  stopEventThen,
  getEventKey,
  getEventKeyCode,
  path
}
