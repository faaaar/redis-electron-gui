import {
  UPDATE_CONNECT_CONFIG,
} from '../actions/global'

const initState = {
  connectConfig: {
  },
}

export default (state = initState, action) => {
  const {
    type,
    connectConfig,
  } = action

  switch (type) {
    case UPDATE_CONNECT_CONFIG:
      return Object.assign({}, state, {connectConfig})
    default:
      return state
  }
}
