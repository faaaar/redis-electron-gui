import { createStore, applyMiddleware, compose } from 'redux'
import createRootReducer from '@reducer'
import thunk from 'redux-thunk'
import DevTools from '@view/DevTools'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()

var enhancer = null

if (process.env.NODE_ENV === 'production') {
  enhancer = compose(
    applyMiddleware(thunk),
  )
} else {
  enhancer = compose(
    applyMiddleware(thunk),
    DevTools.instrument(),
  )
}

// 创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。
const initState = {}
let store = createStore(
  createRootReducer(history),
  initState,
  enhancer,
)

export default store
