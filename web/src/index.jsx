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
            <Switch>
              <Route exact={true} path="/" component={RedisView} />
            </Switch>
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

