import {
  UPDATE_CONNECT_CONFIG,
  SWITCH_TABS,
} from '../actions/global'

const initState = {
  connectConfig: {
  },
  activeTabKey: '/',
}

export default (state = initState, action) => {
  const {
    type,
    connectConfig,
    activeTabKey,
  } = action

  switch (type) {
    case UPDATE_CONNECT_CONFIG:
      return Object.assign({}, state, {connectConfig})
    case SWITCH_TABS:
      return Object.assign({}, state, {activeTabKey})
    default:
      return state
  }
}
