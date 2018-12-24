import React from 'react'
import RedisKey from './RedisKey'
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

      selectedRedis: '', 

      searchKey: '',
      searchData: [],

      selectedKey: '',
      
      SearchRedis: this.SearchRedis.bind(this),
      SelectRedis: this.SelectRedis.bind(this),
      SelectNode: this.SelectNode.bind(this),
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

  SelectNode(node) {
    console.log(node)
  }

  SelectRedis(selectedRedis) {
    this.setState({
      selectedRedis,
    })
  }

  async SearchRedis(searchKey) {
    const selectedRedis = this.state.selectedRedis
    const searchData = await ipc.redisExec(selectedRedis, 'keys', [searchKey])

    console.log(searchData)
    this.setState({
      searchData,
    })
  }
  
  render() {
    return (
      <Provider value={this.state}>
        <div className="app-redis">
          <div className="app-redis-option-panel">
            <OptionPanel />
          </div>
          <div className="app-redis-data-panel">
            <RedisKey />
          </div>
        </div>
      </Provider>
    )
  }
}
