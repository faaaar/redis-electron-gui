import React from 'react'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  Input,
  List,
  Select,
  Icon,
  Tooltip,
  Modal,
} from 'antd'
import Detail from './detail'

import {
  SearchKeys,
  SearchKeyDetail,
} from '@action/redis'
import KeyList from './components/KeyList'
import KeyDetail from './components/KeyDetail'

const Option = Select.Option

class DataView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      showModal: false,
      modalData: {},
      selectData: {},
    }
  }
  
  async onSearch(connInfo, searchKey) {
    this.setState({
      loading: true,
    })

    await this.props.SearchKeys(connInfo, searchKey)

    this.setState({
      loading: false,
    })
  }
  
  async onSelect(connInfo, item) {
    const obj = await this.props.SearchKeyDetail(connInfo, item)

    this.setState({
      selectData: obj,
    })
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
        <KeyDetail
          isEdit={this.state.isEdit}
          submit={data => this.props.AddConnectConfig(data)}
          data={this.state.modalData}
        />
      </Modal>
    )
  }
  
  render() {
    const connInfo = this.props.getCurrConn() || {}
    const data = this.props.keys[connInfo.id] || []
    
    return (
      <div>
        <Row>
          <Col span={6}>
            <KeyList
              loading={this.state.loading}
              data={data}
              onSearch={searchKey => this.onSearch(connInfo, searchKey)}
              onSelect={item => this.onSelect(connInfo, item)}
            />
          </Col>
          <Col span={18}>
            <KeyDetail
              data={this.state.selectData}
            />
          </Col>
        </Row>
      </div>
    )
  }
} 

const mapDispatchToProps = dispatch => ({
  SearchKeys: (connInfo, searchKey) => SearchKeys(connInfo, searchKey, dispatch),
  SearchKeyDetail: async (connInfo, item, field) => await SearchKeyDetail(connInfo,item,field),
})

const mapStateToProps = state => ({
  currAlias: state.global.currAlias,
  connectConfig: state.global.connectConfig,
  connInfoList: state.redis.connInfoList,
  select: state.redis.select,
  keys: state.redis.keys,

  getCurrConn: () => state.redis.connInfoList[state.global.currAlias],
  getConnInfo: alias => state.redis.connInfoList[alias],
  getSelect: rdsID => state.redis.select[rdsID],
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataView)



