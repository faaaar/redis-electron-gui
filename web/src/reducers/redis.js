import {
  REDIS_CONNECT,
  REDIS_DISCONNECT,
} from '../actions/redis'

const initState = {
  connInfo: [
    // {
    //   id: '',
    //   alias: '',
    //   host: '',
    //   port: '',
    //   auth: '',
    // }
  ],
}

export default (state = initState, action) => {
  const {
    type,
    connInfo,
  } = action

  switch (type) {
    case REDIS_DISCONNECT:
    case REDIS_CONNECT:
      return Object.assign({}, state, {connInfo})
    default:
      return state
  }
}
