import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal } from 'antd'
import {
  SearchKeys,
  SearchKeyDetail,
  RedisSetValue,
  RedisDeleteKey,
  RedisDeleteField,
  RedisSetExpire,
} from '@action/redis'
import { AddConnectConfig } from '@action/global'
import KeyList from './components/KeyList'
import KeyDetail from './components/KeyDetail'
import KeyModal from './components/KeyModal'

class DataView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      showModal: false,
      modalData: {},
      showDetail: false,
      searchKey: '',
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
        idx: -1,
      },
      _value: {
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
        idx: -1,
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
      searchKey,
    })
  }

  async onSelect(connInfo, item) {
    const obj = await SearchKeyDetail(connInfo, item)
    const type = obj.type
    const values = obj.values
    let fieldList = []
    let memberList = []

    switch(type) {
      case 'list':
        fieldList = values
        break
      case 'set':
        memberList = values
        break
      case 'zset':
        memberList = Object.keys(values)
        break
      default:
        fieldList = Object.keys(values)
        break
    }

    const value = {
      type,
      values,
      ttl: obj.ttl,
      key: obj.key,
      value: item.type === 'string' ? obj.values : '',
      fieldList,
      memberList,
      member: '',
      field: '',
      score: 0,
      idx: -1,
    }
    this.setState({
      value,
      _value: { ...value },
    })
  }

  renderKeyModal() {
    const showModal = this.state.showModal
    if (!showModal) {
      return <div />
    }
    const modalData = this.state.modalData

    return (
      <Modal
        title="Key Config"
        visible={showModal}
        mask={true}
        maskClosable={false}
        footer={null}
        onCancel={() => this.setState({
          showModal: false,
          modalData: {},
        })}
      >
        <KeyModal />
      </Modal>
    )
  }

  render() {
    const connInfo = this.props.getCurrConn() || {}
    const data = this.props.keys[connInfo.id] || []
    const { value, _value } = this.state
    const setValue = value => this.setState({ value })
    const _setValue = _value => this.setState({ _value })

    return (
      <div>
        <Row>
          <Col span={6}>
            <KeyList
              value={this.state.value}
              loading={this.state.loading}
              data={data}
              onSearch={searchKey => this.onSearch(connInfo, searchKey)}
              onSelect={item => this.onSelect(connInfo, item)}
            />
          </Col>
          <Col span={18}>
            <KeyDetail
              newKey={() => {
                this.setState({
                  showModal: true,
                  modalData: {},
                })
                console.log("New")
              }}
              deleteKey={async () => {
                await RedisDeleteKey(connInfo, value)
                await this.onSearch(connInfo, this.state.searchKey)
              }}
              saveValue={type => {
                switch(type) {
                  case 'normal':
                    RedisSetValue(connInfo, value, _value)
                    break
                  case 'ttl':
                    RedisSetExpire(connInfo, value)
                    break
                }                
              }}
              deleteField={async () => {
                await RedisDeleteField(connInfo, value, _value)
                await this.onSelect(connInfo, value)
              }}
              data={[ value, setValue ]}
              _data={[ _value, _setValue ]}
            />
          </Col>
        </Row>
        {this.renderKeyModal()}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  SearchKeys: (connInfo, searchKey) => SearchKeys(connInfo, searchKey, dispatch),
  AddConnectConfig: config => dispatch(AddConnectConfig(config)),
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



