import React from 'react'
import {Button} from 'antd'

import { Provider } from './context' 
import ipc from '../../request/ipc'
import EVENTS from '../../request/events'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  async componentDidMount() {
    const data = await ipc.send({
      type: EVENTS.CONNECT,
      data: {
        host: '127.0.0.1',
        port: '6379',
        password: '123456',
      },
    })

    console.log(data)
  }

  async onClickTest() {
    const data = await ipc.redisExec('keys', ['*'])
    console.log(data)
  }  
  
  render() {
    return (
      <Provider value={this.state}>
        <div className="app-redis">
          <Button onClick={async () => await this.onClickTest()}>Click Me</Button>
        </div>
      </Provider>
    )
  }
}
