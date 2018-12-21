import React from 'react'
import { Layout, Button } from 'antd'
import RDKeyList from './RDKeyList'
import { Provider } from './context' 
import ipc from '../../request/ipc'
import EVENTS from '../../request/events'

const { Sider } = Layout
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: [],
      searchKey: '',
      redisData: {
        // KEY: [],
      },

      SearchRedis: this.SearchRedis.bind(this),
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

  SearchRedis(treeNode) {
    return new Promise(async (resolve) => {
      const key = this.state.searchKey || '*'
      const clientName = treeNode.props.eventKey
      const dataList = await ipc.redisExec(clientName, 'keys', key)
      const redisData = this.state.redisData
      redisData[clientName] = dataList

      this.setState({
        redisData,
      })

      resolve()
    })
  }
  
  render() {
    return (
      <Provider value={this.state}>
        <div className="app-redis">
          <RDKeyList />
        </div>
      </Provider>
    )
  }
}
