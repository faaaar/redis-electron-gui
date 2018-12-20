import 'react-app-polyfill/jsdom'
import React from 'react'
import ReactDOM from 'react-dom'
import { Layout, Menu, Icon, } from 'antd';
import {
  BrowserRouter,
  Route,
  Switch,
  NavLink,
} from 'react-router-dom'

import RedisView from './views/Redis' 
import * as serviceWorker from './serviceWorker'
import './index.scss'

const { Header, Sider } = Layout

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 'redis',
    }
  }

  componentDidMount() {
    // if (window.location.pathname === '/') {
    //   window.location.href = '/'
    // }
  }
  
  handleClick = e => {
    this.setState({
      current: e.key,
    })
  }
  
  render() {
    return (
      <BrowserRouter basename="/"> 
        <div className="app"> 
          <Layout>
            <Header>
              <Menu
                onClick={this.handleClick}
                selectedKeys={[ this.state.current ]}
                mode="horizontal">
                <Menu.Item key="redis">
                  <Icon type="block" />Redis
                </Menu.Item>
              </Menu>
            </Header>
            <Layout>
              <Sider>
                <Menu
                  className="docker-menu"
                  style={{ height: '100%' }} 
                  mode="inline"
                  onClick={e => this.handleClick(e)}
                  defaultSelectedKeys={[ `redis` ]}>
                  <Menu.Item style={{marginTop: 0}} key={`redis`}>
                    <NavLink to="/">Filter</NavLink>
                  </Menu.Item>
                </Menu>
              </Sider> 
              <Layout>
                <Switch>
                  <Route exact={true} path="/" component={RedisView} />
                </Switch>
              </Layout>
            </Layout>
          </Layout> 
        </div>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app-root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

