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

import {
  SearchKeys,
  SetFilterKey,
  SetSearchKey,
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

  onFilterKeyChange(e) {
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
      if (list[i].match(keyWord) != null) {
        arr.push(list[i]);
      }
    }
    return arr;
  }
  
  renderKeyListHeader() {
    const searchKey = this.getRedisSearchKey()
    const filterKey = this.getRedisFilterKey()
    
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
            value={filterKey}
            onChange={e => this.onFilterKeyChange(e)}
            type="text"
            placeholder="Key name, support regexp."
            prefix={<Icon type="filter" />}
          />
        </div>
      </div>
    )
  }

  renderKeyListItem(item) {
    return (
      <Tooltip mouseEnterDelay={0.5} title={item}>
        <List.Item className="list-item">
          {item}
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
          <Col className="key-detail" span={18}>
            <Col className="key-fields" span={6}></Col>
            <Col className="fields-value" span={18}></Col>
          </Col>
        </Row>
      </div>
    )
  }
} 

export default connect(state => ({
  global: state.global,
  redis: state.redis,
}))(DataView)
