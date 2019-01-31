import React from 'react'
import RedisKeyList from './RedisKeyList'
import RedisKeyDetail from './RedisKeyDetail'
import OptionPanel from './OptionPanel'
import { Provider } from './context' 
import ipc from '../../request/ipc'
import EVENTS from '../../request/events'
import './index.scss'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: [],

      currentRedis: 'work_test', 

      searchKey: 'lyf_*',
      searchData: [],

      currentIndex: -1,
      currentKey: '',
      currentData: null,
      currentType: '',     
      currentTtl: -1,
      
      isAddData: false,
      
      ipcSearchRedis: this.ipcSearchRedis.bind(this),
      ipcSetStringKey: this.ipcSetStringKey.bind(this),
      ipcDeleteRedisKey: this.ipcDeleteRedisKey.bind(this),
      ipcGetDataType: this.ipcGetDataType.bind(this),
      ipcGetData: this.ipcGetData.bind(this),
      updateState: this.updateState.bind(this),
      updateIsAddStatus: this.updateIsAddStatus.bind(this),
      resetCurrent: this.resetCurrent.bind(this),
    }
  }
  
  updateIsAddStatus(isAddData) {
    if (isAddData) {
      this.resetCurrent({
        isAddData,
      })
    } else {
      this.state.updateState({
        isAddData,
      })
    }
  }

  updateState(nextState) {
    this.setState(nextState)
  }

  resetCurrent(extend) {
    this.state.updateState({
      currentKey: '',
      currentData: '',
      currentType: 'string',     
      currentTTL: -1,
      currentIndex: -1,
      ...extend,
    })
  }

  async componentDidMount() {
    const config = await ipc.send({
      type: EVENTS.CONFIG,
    })

    this.setState({
      config,
    })
  }

  async ipcSetStringKey() {
    const {
      currentRedis,
      currentKey,
      currentData,
      searchKey,
    } = this.state
    const res = await ipc.redisExec(currentRedis, 'set', [currentKey, currentData])

    if (res) {
      await this.state.ipcSearchRedis(searchKey)
    }

    this.state.updateState({
      isAddData: false,
    })
  }

  async ipcDeleteRedisKey() {
    const {
      currentRedis,
      currentKey,
      searchKey,
    } = this.state
    const res = await ipc.redisExec(currentRedis, 'del', [currentKey])
    if (res > 0) {
      await this.state.ipcSearchRedis(searchKey)
      this.state.updateState({
        currentData: null,
        currentKey: '',
        currentType: '',
        currentTTL: '',
      })
    }
  }

  async ipcGetData(type, keys) {
    const currentRedis = this.state.currentRedis
    const dataType = await this.state.ipcGetDataType(keys)

    let cmd = ''
    switch(dataType) {
      case 'string':
        cmd = 'get'
        break
      case 'hash':
        cmd = 'hgetall'
        break
      default:
        cmd = ''
        break
    }

    if (cmd === '') {
      return false
    }
    
    const data = await ipc.redisExec(currentRedis, cmd, keys)
    
    return data
  }

  async ipcGetDataType(keys) {
    const currentRedis = this.state.currentRedis
    const dataType = await ipc.redisExec(currentRedis, 'type', keys)
    
    return dataType
  }
  

  async ipcSearchRedis(searchKey) {
    const currentRedis = this.state.currentRedis

    if (!currentRedis) {
      alert('请选择redis')
      return
    }
    
    const searchData = await ipc.redisExec(currentRedis, 'keys', [searchKey])

    this.state.updateState({
      searchData,
    })
  }
  
  render() {    
    return (
      <Provider value={this.state}>
        <div className='app-redis'>
          <div className='app-redis-option-panel'>
            <OptionPanel />
            <RedisKeyList />
          </div>
          <div className='app-redis-data-panel'>
            <RedisKeyDetail />
          </div>
        </div>
      </Provider>
    )
  }
}
