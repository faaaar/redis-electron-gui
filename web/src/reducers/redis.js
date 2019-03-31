import { 
  REDIS_CONNECT,
  REDIS_DISCONNECT,
  REDIS_FILTER_KEYS,
} from '../actions/redis'

const initState = {
  connInfo: [
    // {
    //   id: '',
    //   alias: '',
    //   host: '',
    //   port: '',
    //   auth: '',
    //   client: null,
    // }
  ],
  keys: {
    // id: [],
  },
}

export default (state = initState, action) => {
  const {
    type,
    connInfo,
    keys,
    redisID,
  } = action

  switch (type) {
    case REDIS_DISCONNECT:
    case REDIS_CONNECT:
      return Object.assign({}, state, {connInfo})
    case REDIS_FILTER_KEYS:
      const oriKeys = state.keys
      oriKeys[redisID] = keys
      return Object.assign({}, state, {
        keys: oriKeys,
      })
    default:
      return state
  }
}
