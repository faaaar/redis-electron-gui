import React from 'react'
import { Menu, Icon, Modal } from 'antd'
import { SwitchRedis, AddConnectConfig, GetConnectConfig } from '@action/global'
import { DisconnectRedis, ConnectToRedis } from '@action/redis'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import RedisConfigModal from './components/RedisConfigModal'

const { SubMenu } = Menu
const MenuItem = Menu.Item

class AppTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      showModal: false,
      modalData: {},
      isEdit: false,
    }
  }
  componentDidMount() {
    this.props.GetConnectConfig()
    this.props.history.replace('/')
  }
  
  onClickMenuItem(e) {
    const key = e.key
    
    if (key === 'add') {
      // this.props.history.push("/")
      this.setState({
        showModal: true,
        isEdit: false,
        modalData: {},
      })
      
      return
    }

    const arr = key.split('-')
    const operate = arr[0]
    const alias = arr[1]

    switch(operate) {
      case 'edit':
        this.setState({
          modalData: {
            ...this.props.getConnConfig(alias),
            alias,
          },
          isEdit: true,
          showModal: true,
        })
        break
      case 'del':
        break
      case 'connect':
        this.props.ConnectToRedis(
          this.props.getConnConfig(alias),
          alias => {
            this.props.history.push('/view/' + alias)
          }
        )
        this.props.history.push(`/view/${alias}`)
        this.props.SwitchRedis(alias)
        break
      default:
        console.error('INVALID OPERATE')
        break
    }
  }

  renderModal() { 
    if (!this.state.showModal) {
      return <div />
    }
    
    return (
      <Modal
        title="Reids Config"
        visible={this.state.showModal}
        mask={true}
        maskClosable={false}
        footer={null}
        onCancel={() => this.setState({
          showModal: false,
          modalData: {},
          isEdit: false,
        })}
      >
        <RedisConfigModal
          isEdit={this.state.isEdit}
          submit={data => this.props.AddConnectConfig(data)}
          data={this.state.modalData}
        />
      </Modal>
    )
  }

  render() {
    const alias = this.props.alias
    const connectConfig = this.props.connectConfig || {}
    const confKeys = Object.keys(connectConfig)

    return (
      <>
        <Menu
          onClick={e => this.onClickMenuItem(e)}
          selectedKeys={[alias]}
          mode="vertical"
        >
          <MenuItem key="add">
            <Icon type="setting" />
            <span>新增Redis连接</span>
          </MenuItem>
          
          {
            confKeys.map(alias => (              
              <SubMenu
                key={alias}
                title={
                  <span>
                    <Icon type="tool" />
                    <span>{alias}</span>
                  </span>
                }
              >
                <MenuItem key={`connect-${alias}`}>连接</MenuItem>
                <MenuItem key={`edit-${alias}`}>编辑</MenuItem>
                <MenuItem key={`del-${alias}`}>删除</MenuItem>
              </SubMenu>
            ))
          }
        </Menu>
        {this.renderModal()}
      </>
    )
  }   
}

const mapStateToProps = state => ({
  alias: state.global.alias,
  connInfoList: state.redis.connInfoList,
  connectConfig: state.global.connectConfig,
  getConnInfo: idx => state.redis.connInfoList[idx],
  getConnConfig: alias => ({ ...state.global.connectConfig[alias], alias }),
})

const mapDispatchToProps = dispatch => ({
  ConnectToRedis: async connInfo => await ConnectToRedis(connInfo, dispatch),
  DisconnectRedis: key => dispatch(DisconnectRedis(key)),
  SwitchRedis: tabs => dispatch(SwitchRedis(tabs)),
  AddConnectConfig: value => dispatch(AddConnectConfig(value)),
  GetConnectConfig: () => dispatch(GetConnectConfig()),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppTabs))
