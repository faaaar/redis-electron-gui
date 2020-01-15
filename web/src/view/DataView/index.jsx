import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal } from 'antd'
import { SearchKeys, SearchKeyDetail } from '@action/redis'
import KeyList from './components/KeyList'
import KeyDetail from './components/KeyDetail'

class DataView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      showModal: false,
      modalData: {},
      showDetail: false,
      value: {
        ttl: -1,
        type: '',
        value: '',
        field: '',
        fieldList: [],
        memberList: [],
        values: {},
        key: '',
        score: '',
        member: '',
      },
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

    const type = obj.type
    const values = obj.values
    let fieldList = []
    let memberList = []
    
    switch(type) {
      case 'set':
      case 'list':
        fieldList = values
        break
      case 'zset':
        memberList = Object.keys(values)
        break
      default:
        fieldList = Object.keys(values)
        break
    }
    
    this.setState({
      value: {
        type,
        values,
        ttl: obj.ttl,
        key: obj.key,
        value: item.type === "string" ? obj.values : '',
        fieldList,
        memberList,
        field: '',
        score: 0,
      },
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
              save={() => {
                
              }}
              data={[
                this.state.value,
                value => {
                  this.setState({value})
                },
              ]}
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



