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

      selectedRedis: 'work_test', 

      searchKey: 'lyf_*',
      searchData: [],

      currentKey: '',
      currentData: null,
      currentType: '',     
      currentTtl: -1,
      
      isAddData: false,
      
      ipcSearchRedis: this.ipcSearchRedis.bind(this),
      ipcUpdateRedisStringKey: this.ipcUpdateRedisStringKey.bind(this),
      ipcDeleteRedisKey: this.ipcDeleteRedisKey.bind(this),
      ipcGetDataType: this.ipcGetDataType.bind(this),
      ipcGetData: this.ipcGetData.bind(this),
      updateState: this.updateState.bind(this),
      updateIsAddStatus: this.updateIsAddStatus.bind(this),
    }
  }
  
  updateIsAddStatus(isAddData) {
    if (isAddData) {
      this.state.updateState({
        isAddData,
        currentKey: '',
        currentData: '',
        currentType: 'string',     
        currentTTL: -1,
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

  async componentDidMount() {
    const config = await ipc.send({
      type: EVENTS.CONFIG,
    })

    this.setState({
      config,
    })
  }

  async ipcUpdateRedisStringKey() {
    const {
      selectedRedis,
      currentKey,
      currentData,
    } = this.state
    const res = await ipc.redisExec(selectedRedis, 'set', [currentKey, currentData])

    alert(res)
  }

  async ipcDeleteRedisKey(redis, key) {
    const res = await ipc.redisExec(redis, 'del', [key])

    if (res === 1) {

    }
    alert(res)
  }

  async ipcGetData(type, keys) {
    const selectedRedis = this.state.selectedRedis
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

    if (cmd == '') {
      return false
    }
    
    const data = await ipc.redisExec(selectedRedis, cmd, keys)
    
    return data
  }

  async ipcGetDataType(keys) {
    const selectedRedis = this.state.selectedRedis
    const dataType = await ipc.redisExec(selectedRedis, 'type', keys)
    
    return dataType
  }
 

  async ipcSearchRedis(searchKey) {
    const selectedRedis = this.state.selectedRedis

    if (!selectedRedis) {
      alert('请选择redis')
      return
    }
    
    const searchData = await ipc.redisExec(selectedRedis, 'keys', [searchKey])

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
