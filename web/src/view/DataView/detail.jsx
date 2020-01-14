import React from 'react'
import {connect} from 'react-redux'
import {
  Col,
  Row,
  List,
  Input,
  Button,
  message,
} from 'antd'

import {
  RedisSelectKeyField,
  RedisSelectValueChange,
  RedisSaveSelectKey,
}  from '@action/redis'

import './detail.scss'

const { TextArea } = Input;

class  Detail extends React.Component {

  getRedisConnInfo() {
    const idx = this.props.match.params.id

    return this.props.redis.connInfo[idx] || {}
  }

  getSelectInfo() {
    const connInfo = this.getRedisConnInfo()
    
    return this.props.redis.select[connInfo.id] || {}
  }
  
  renderItem(item, selectField) {
    const redisIDX = this.props.match.params.id
    
    return (
      <List.Item
        onClick={e => RedisSelectKeyField(redisIDX, item.idx)}
        className={`list-item ${selectField === item.idx ? 'selected' : ''}`}
      >
        <span className="field">{item.field}</span>
      </List.Item>
    )
  }

  renderFieldsHeader() {
    return (
      <span>Field / Score</span>
    )
  }

  genFieldListProps() {
    const {
      keyValue,
      keyType,
      selectField,
    } = this.getSelectInfo()

    const props = {
      className: "field-list",
      size: "small",
      header: this.renderFieldsHeader(),
      bordered: true,
      renderItem: item => this.renderItem(item, selectField),
    }

    switch (keyType) {
      case 'hash':
        props.dataSource = Object.keys(keyValue).map(field => ({field, idx: field}))
        
        break
      case 'set':
        props.dataSource = keyValue.map((field, idx) => ({field, idx}))
        
        break
      case 'zset':
        const dataSource = []
        const l = keyValue.length / 2
        
        for (let i = 0; i < l; i++) {
          dataSource.push({
            idx: i,
            field: keyValue[i*2+1],
          })
        }

        props.dataSource = dataSource
        break
      case 'list':
        props.dataSource = keyValue.map((field, idx) => ({field, idx}))
        
        break
      default:
        props.dataSource = []
        
        break
    }

    return props
  }

  renderDetail() {
    const redisIDX = this.props.match.params.id
    const props = this.genFieldListProps()
    const showKeyFileds = !!props.dataSource.length
    
    return(
      <Col className="key-detail" span={18}>
        {showKeyFileds ? <Col className="key-fields" span={6}><List {...props} /></Col> : ''}
        <Col className="fields-value" span={showKeyFileds ? 18 : 24}>
          <Row>
            <TextArea
              onChange={e => RedisSelectValueChange(redisIDX, e.target.value)}
              value={this.getSelectInfo().selectValue}
              autosize={{
                minRows: 28,
                maxRows: 28,
              }}
            />
          </Row>
          <Row>
            <Button
              onClick={() => RedisSaveSelectKey(redisIDX) && message.success("Save successful")}
              type="primary"
            >
              Submit
            </Button>
          </Row>
        </Col>
      </Col>
    ) 
  }

  render() {
    const {
      key,
    } = this.getSelectInfo()

    return !key ? <div /> : this.renderDetail()
  }
}

export default connect(state =>  ({
  global: state.global,
  redis: state.redis,
}))(Detail)
