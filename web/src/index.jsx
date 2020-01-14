import 'react-app-polyfill/jsdom'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider, connect} from 'react-redux'
import { Layout, Tabs } from 'antd';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom'
import {
  withRouter,
} from 'react-router'
import store from './store'

import {
  DisconnectRedis, 
} from './actions/redis'

import {
  GetConnectConfig, 
  SwitchTabs,
} from './actions/global'

import ConnView from './views/ConnView' 
import DataView from './views/DataView'
import DevTools from './views/DevTools'

import * as serviceWorker from './serviceWorker'
import './index.scss'

const TabPane = Tabs.TabPane
const {
  Header,
  Content,
} = Layout

const AppTabs = withRouter(connect(state => ({
  redis: state.redis,
  global: state.global,
}))(
  class extends React.Component {
    componentDidMount() {
      this.props.history.replace('/')
    }
    
    onTabChange(key) {
      if (key === '/') {
        this.props.history.push("/")
      } else {
        this.props.history.push(`/view/${key}`)
      }

      SwitchTabs(key)
    }

    onEditTabs(key, actions) {
      if (actions === 'remove'&& key !== '/') {
        DisconnectRedis(key)

        this.props.history.push('/')
        SwitchTabs('/')
      }
    }
    
    render() {
      const activeTabKey = this.props.global.activeTabKey

      return (
        <Tabs
          activeKey={activeTabKey}
          hideAdd={true}
          onEdit={(key, action) => this.onEditTabs(key, action)}
          type="editable-card"
          className="app-tabs"
          onChange={key => this.onTabChange(key)}
        >
          <TabPane className="tab-item" tab="Config" key="/" />
          {
            this.props.redis.connInfo.map((conn, i) => (
              <TabPane className="tab-item" tab={conn.alias} key={i} />
            ))
          }
        </Tabs>
      )
    }
  }
))

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 'redis',
    }
  }
  
  componentDidMount() {
    GetConnectConfig()
  }
  
  render() {
    let devTool = process.env.NODE_ENV === 'production' ? '' :  (<div style={{fontSize: '18px'}}><DevTools /></div>)

    return (
      <BrowserRouter basename="/">
        <div className="app">
          {devTool}
          <Layout className="app-layout">
            <Header className="app-header">
              <AppTabs />
            </Header>
            <Content className="app-content">
              <Switch>
                <Route exact={true} path="/" component={ConnView} />
                <Route exact={true} path="/view/:id" component={DataView} />
              </Switch>
            </Content>
          </Layout>
        </div>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app-root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
