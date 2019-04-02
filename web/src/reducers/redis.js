import { 
  REDIS_CONNECT,
  REDIS_DISCONNECT,
  REDIS_SCAN,
  REDIS_FILTER_KEY_SET,
  REDIS_SEARCH_KEY_SET,
  REDIS_KEY_DETAIL,
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
  searchKey: {
    // id: '',
  },
  filterKey: {
    // id: '',
  },
  select: {
    // id: {}
    key: '',
    keyType: '',
    keyValue: [],
  }
}

export default (state = initState, action) => {
  const {
    type,
    connInfo,
    keys,
    key,
    keyValue,
    keyType,
    redisID,
  } = action

  switch (type) {
    case REDIS_DISCONNECT:
    case REDIS_CONNECT:
      return Object.assign({}, state, {connInfo})
    case REDIS_SCAN:
      const keysTmp = state.keys
      
      keysTmp[redisID] = keys
      
      return Object.assign({}, state, {
        keys: keysTmp,
      })
    case REDIS_SEARCH_KEY_SET:
      const searchKeyTmp = state.searchKey

      searchKeyTmp[redisID] = key

      return Object.assign({}, state, {
        searchKey: searchKeyTmp
      })
    case REDIS_FILTER_KEY_SET:
      const filterKeyTmp = state.filterKey
      
      filterKeyTmp[redisID] = key
      
      return Object.assign({}, state, {
        filterKey: filterKeyTmp
      })
    case REDIS_KEY_DETAIL:
      const origSelect = state.select
      
      origSelect[redisID] = {
        key,
        keyValue,
        keyType,
      }
      
      return Object.assign({}, state, {
        select: origSelect,
      })
    default:
      return state
  }
}
