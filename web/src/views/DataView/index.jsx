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
} from 'antd'
import Detail from './detail'

import {
  SearchKeys,
  SetFilterKey,
  SetSearchKey,
  SearchKeyDetail,
} from '../../actions/redis'

import './index.scss'

const Option = Select.Option

class DataView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }
  }

  onPressToFilte(e) {
    const connInfo = this.getRedisConnInfo()
    const filterKey = e.target.value
    
    SetFilterKey(connInfo.id, filterKey)
  }
  
  onSearchKeyChange(e) {
    const connInfo = this.getRedisConnInfo()
    const searchKey = e.target.value

    SetSearchKey(connInfo.id, searchKey)
  }
  
  renderKeyListFooter() {
    return (
      <Row className="list-footer">
        <Col>
          <Select defaultValue="0">
            {
              [0,1,2,3,4,5,6,7,8,9].map(i => <Option key={i} value={i}>{i}</Option>)
            }
          </Select>
        </Col>
      </Row>
    )
  }

  async onClickToSearch() {
    this.setState({
      loading: true,
    })
    
    await SearchKeys(this.getRedisSearchKey())

    this.setState({
      loading: false,
    })
  }

  getRedisConnInfo() {
    const idx = this.props.match.params.id

    return this.props.redis.connInfo[idx] || {}
  }

  getRedisSearchKey() {
    const connInfo = this.getRedisConnInfo()
    
    return this.props.redis.searchKey[connInfo.id]
  }

  getRedisFilterKey() {
    const connInfo = this.getRedisConnInfo()
    
    return this.props.redis.filterKey[connInfo.id]
  }

  getRedisKeys() {
    const connInfo = this.getRedisConnInfo()
    const filter = this.getRedisFilterKey() || ''
    
    let arr = (this.props.redis.keys[connInfo.id] || [])

    const filterArray = filter.split(' ')

    filterArray.forEach(filter => {
      arr = this.fuzzyQuery(arr, filter)
    })
    
    return arr.slice(0, 100)
  }

  fuzzyQuery(list, keyWord) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].key.match(keyWord) != null) {
        arr.push(list[i]);
      }
    }
    return arr;
  }
  
  renderKeyListHeader() {
    const searchKey = this.getRedisSearchKey()
    
    return (
      <div className="list-header">
        <div className="search">
          <Input
            value={searchKey}
            onChange={e => this.onSearchKeyChange(e)}
            type="text"
            placeholder="Key name, support regexp."
            prefix={<Icon type="search" />}
            onPressEnter={() => this.onClickToSearch()}
          />
        </div>
        <div className="filter">
          <Input
            type="text"
            placeholder="Key name, support regexp."
            prefix={<Icon type="filter" />}
            onPressEnter={e => this.onPressToFilte(e)}
          />
        </div>
      </div>
    )
  }

  onClickListItem(e, item) {
    const idx = this.props.match.params.id
    
    SearchKeyDetail(idx, item)
  }

  renderKeyListItem(item) {
    const isSelectMe = item.key === this.props.redis.select.key
    
    return (
      <Tooltip mouseEnterDelay={0.5} title={item.key}>
        <List.Item
          className={`list-item ${isSelectMe ? 'selected' : ''}`}
          onClick={e => this.onClickListItem(e, item)}
        >
          <span className={`type ${item.type}`}>{item.type}</span>
          <span className="key">{item.key}</span>
        </List.Item>
      </Tooltip>
    )
  }

  render() {
    const data = this.getRedisKeys()

    return (
      <div className="data-view">
        <Row className="container">
          <Col className="key-tree" span={6}>
            <List
              loading={this.state.loading}
              className="key-list"
              size="small"
              header={this.renderKeyListHeader()}
              bordered
              dataSource={data}
              renderItem={item => this.renderKeyListItem(item)}
            />
            {this.renderKeyListFooter()}
          </Col>
          <Detail />
        </Row>
      </div>
    )
  }
} 

export default connect(state => ({
  global: state.global,
  redis: state.redis,
}))(DataView)
