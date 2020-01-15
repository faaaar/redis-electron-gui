import { 
  REDIS_CONNECT,
  REDIS_DISCONNECT,
  REDIS_SCAN,
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
  const keysTmp = state.keys
  const nextSelect = state.select

  switch (type) {
    case REDIS_DISCONNECT:
      state.connInfoList.splice(rdsIdx, 1)
      
      return Object.assign({}, state)
    case REDIS_CONNECT:
      state.connInfoList[connInfo.alias] = connInfo
      return Object.assign({}, state)
    case REDIS_SCAN:
      
      keysTmp[redisID] = keys
      
      return Object.assign({}, state, {
        keys: keysTmp,
      })  
    case REDIS_KEY_DETAIL:
      
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
