import { render } from 'react-dom'
import store from './store'
import { useStoreProvider } from './common/component'
import app from './app'

render(useStoreProvider(store, app.fold({})), document.getElementById('app'))
