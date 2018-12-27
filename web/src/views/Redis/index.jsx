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

      selectedKey: '',
      selectedData: '',
      selectedType: '',
      
      SearchRedis: this.SearchRedis.bind(this),
      SelectRedis: this.SelectRedis.bind(this),
      SelectNode: this.SelectNode.bind(this),
      UpdateRedisStringKey: this.UpdateRedisStringKey.bind(this)
    }
  }

  async componentDidMount() {
    const config = await ipc.send({
      type: EVENTS.CONFIG,
    })

    this.setState({
      config,
    })
  }

  async UpdateRedisStringKey(redis,key, value) {
    const res = await ipc.redisExec(redis, 'set', [key, value])

    alert(res)
  }

  async SelectNode(node) {
    if (!node || !node.length) {
      return
    }
    
    const selectedRedis = this.state.selectedRedis
    if (!selectedRedis) {
      alert('请选择redis')
      return
    }
    
    const dataType = await ipc.redisExec(selectedRedis, 'type', node)
    if (!dataType) {
      return
    }

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

    if (cmd !== '') {
      const selectedData = await ipc.redisExec(selectedRedis, cmd, node)
      if (!selectedData) {
        return
      }
      
      this.setState({
        selectedKey: node[0],
        selectedData: selectedData,
        selectedType: dataType,
      })
    } else {
      alert(`${dataType} not support`)
    }
  }

  SelectRedis(selectedRedis) {
    console.log(selectedRedis)
    this.setState({
      selectedRedis,
    })
  }

  async SearchRedis(searchKey) {
    const selectedRedis = this.state.selectedRedis

    if (!selectedRedis) {
      alert('请选择redis')
      return
    }
    
    const searchData = await ipc.redisExec(selectedRedis, 'keys', [searchKey])

    console.log(searchData)
    this.setState({
      searchData,
    })
  }
  
  render() {
    return (
      <Provider value={this.state}>
        <div className='app-redis'>
          <div className='app-redis-option-panel'>
            <OptionPanel />
          </div>
          <div className='app-redis-data-panel'>
            <RedisKeyList />
            <RedisKeyDetail />
          </div>
        </div>
      </Provider>
    )
  }
}
