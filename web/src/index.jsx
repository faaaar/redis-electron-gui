import 'react-app-polyfill/jsdom'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Layout } from 'antd'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import store from './store' 

import DataView from '@view/DataView'
import DevTools from '@view/DevTools' 
import SiderList from '@view/SiderList'

import * as serviceWorker from './serviceWorker'
import './index.scss'

const {
  Content,
  Sider,
} = Layout

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 'redis',
      collapsed: false,
    }
  }
   
  render() {
    let devTool = process.env.NODE_ENV === 'production' ? '' :  (<div style={{ fontSize: '18px' }}><DevTools /></div>)

    return (
      <BrowserRouter basename="/">
        <div className="app">
          {devTool}
          <Layout className="app-layout">
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={collapsed => this.setState({ collapsed })}
              theme="light"
            >
              <SiderList />
            </Sider>
            <Layout>
              <Content className="app-content">
                <Switch>
                  {/* <Route exact={true} path="/" component={ConnView} /> */}
                  <Route exact={true} path="/view/:id" component={DataView} />
                </Switch>
              </Content>
            </Layout>
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
