import {
  UPDATE_CONNECT_CONFIG,
  SWITCH_REDIS,
} from '@action/global'

const initState = {
  connectConfig: {
  },
  currAlias: '',
}

export default (state = initState, action) => {
  const {
    type,
    connectConfig,
    currAlias,
  } = action

  switch (type) {
    case UPDATE_CONNECT_CONFIG:
      return Object.assign({}, state, { connectConfig })
    case SWITCH_REDIS:
      return Object.assign({}, state, { currAlias })
    default:
      return state
  }
}
