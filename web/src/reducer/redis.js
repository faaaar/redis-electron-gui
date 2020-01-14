import { 
  REDIS_CONNECT,
  REDIS_DISCONNECT,
  REDIS_SCAN,
  REDIS_FILTER_KEY_SET,
  REDIS_SEARCH_KEY_SET,
  REDIS_KEY_DETAIL,
} from '@action/redis'

const initState = {
  connInfoList: {
    // alias: {
    //   redisID: '',
    //   alias: '',
    //   host: '', 
    //   port: '',
    //   auth: '',
    //   client: null,
    // }
  },
  keys: {
    // redisID: [],
  },
  searchKey: {
    // redisID: '',
  },
  filterKey: {
    // redisID: '',
  },
  select: {
    // redisID: {
    //   key,
    //   keyType,
    //   keyValue,
    //   selectField,
    //   selectValue,
    // }
  },
}

export default (state = initState, action) => {
  const {
    type,
    keys,
    key,
    keyValue,
    keyType,
    redisID,
    selectField,
    selectValue,
    rdsIdx,
    connInfo,
  } = action

  switch (type) {
    case REDIS_DISCONNECT:
      const arr = state.connInfoList.splice(rdsIdx, 1)
      if (arr.length) {
        // TODO - disconnect
      }
      
      return Object.assign({}, state)
    case REDIS_CONNECT:
      state.connInfoList[connInfo.alias] = connInfo
      return Object.assign({}, state)
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
        searchKey: searchKeyTmp,
      })
    case REDIS_FILTER_KEY_SET:
      const filterKeyTmp = state.filterKey
      
      filterKeyTmp[redisID] = key
      
      return Object.assign({}, state, {
        filterKey: filterKeyTmp,
      }) 
    case REDIS_KEY_DETAIL:
      const nextSelect = state.select
      
      nextSelect[redisID] = {
        key,
        keyValue,
        keyType,
        selectField,
        selectValue,
      } 
      
      return Object.assign({}, state, {
        select: nextSelect,
      })
    default:
      return state
  }
}
