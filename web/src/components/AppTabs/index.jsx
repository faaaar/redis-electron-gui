import React from 'react'
import { Tabs } from 'antd';
import { SwitchTabs } from '@action/global'
import { DisconnectRedis } from '@action/redis'
import { connect } from 'react-redux'
import { history } from '@store'

const TabPane = Tabs.TabPane

class AppTabs extends React.Component {
  componentDidMount() {
    console.log(this.props)
    this.props.history.replace('/')
  }
  
  onTabChange(key) {
    if (key === '/') {
      this.props.history.push("/")
    } else {
      this.props.history.push(`/view/${key}`)
    }

    this.props.SwitchTabs(key)
  }

  onEditTabs(key, actions) {
    if (actions === 'remove'&& key !== '/') {
      this.props.DisconnectRedis(key)
      this.props.history.push('/')
      this.props.SwitchTabs('/')
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

const mapStateToProps = state => ({
  redis: state.redis,
  global: state.global,
  router: state.router,
  history,
})

const mapDispatchToProps = dispatch => ({
  DisconnectRedis: key => dispatch(DisconnectRedis(key)),
  SwitchTabs: tabs => dispatch(SwitchTabs(tabs)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppTabs)
