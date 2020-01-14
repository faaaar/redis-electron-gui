import React from 'react'
import {connect} from 'react-redux'
import {
  Col,
  Row,
  List,
  Input,
  Button,
} from 'antd'

import { withRouter } from 'react-router'

import {
  RedisSelectKeyField,
  RedisSelectValueChange,
  RedisSaveSelectKey,
}  from '@action/redis'

import './detail.scss'

const { TextArea } = Input;

class Detail extends React.Component { 
  getRedisConnInfo() {
    const idx = this.props.match.params.id

    return this.props.redis.connInfoList[idx] || {}
  }

  getSelectInfo() {
    const connInfo = this.getRedisConnInfo()
    
    return this.props.redis.select[connInfo.id] || {}
  }
  
  renderItem(item, selectField) {
    const rdsIDX = this.props.match.params.id
    const connInfo = this.props.getConnInfo(rdsIDX)
    
    return (
      <List.Item
        onClick={e => this.props.RedisSelectKeyField(
          this.props.getSelect(connInfo.id),
          connInfo.id,
          item.idx,
        )}
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
    const rdsIDX = this.props.match.params.id
    const props = this.genFieldListProps()
    const showKeyFileds = !!props.dataSource.length
    const connInfo = this.props.getConnInfo(rdsIDX)
    if (!connInfo) {
      return <div />
    }
    
    const select = this.props.getSelect(connInfo.id)

    return(
      <Col className="key-detail" span={18}>
        {showKeyFileds ? <Col className="key-fields" span={6}><List {...props} /></Col> : ''}
        <Col className="fields-value" span={showKeyFileds ? 18 : 24}>
          <Row>
            <TextArea
              onChange={e => this.props.RedisSelectValueChange(
                select,
                connInfo.id,
                e.target.value,
              )}
              value={this.getSelectInfo().selectValue}
              autoSize={{
                minRows: 28,
                maxRows: 28,
              }}
            />
          </Row>
          <Row>
            <Button
              // && message.success("Save successful")
              onClick={() => this.props.RedisSaveSelectKey(
                rdsIDX,
                connInfo,
                select,
              )}
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
    return !this.getSelectInfo() ? <div /> : this.renderDetail()
  }
}


const mapDispatchToProps = dispatch => ({
  RedisSelectKeyField: (idx, field)=> dispatch(RedisSelectKeyField(idx, field)),
  RedisSelectValueChange: (idx, value)=> dispatch(RedisSelectValueChange(idx, value)),
  RedisSaveSelectKey: idx => dispatch(RedisSaveSelectKey(idx))
})

const mapStateToProps = state => ({
  global: state.global,
  redis: state.redis,
  router: state.router,
  getConnInfo: idx => state.redis.connInfoList[idx],
  getSelect: rdsID => state.redis.select[rdsID],
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Detail))


