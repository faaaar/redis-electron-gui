import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {
  Col,
  List,
  Input,
  Form,
  Button,
} from 'antd'

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
  

  onClickHashItem(item) {
    console.log('click hash ', item)
    this.props.form.setFieldsValue({
      keyValue: item.value,
    })
  }

  renderHashItem(item, i) {
    return (
      <List.Item
        onClick={e => this.onClickHashItem(item)}
        className="list-item"
      >
        <span className="idx">{i}</span>
        <span className="field">{item.field}</span>
      </List.Item>
    )
  }

  renderListItem(item) {
    return (
      <List.Item>
        {item}
      </List.Item>
    )
  }

  renderFieldsHeader() {
    return (
      <p>Header</p>
    )
  }
  
  renderFields() {
    const {
      keyValue,
      keyType,
    } = this.getSelectInfo()
    const props = {
      className: "field-list",
      size: "small",
      header: this.renderFieldsHeader(),
      bordered: true,
    }

    switch (keyType) {
      case 'hash':
        props.dataSource = Object.keys(keyValue).map(field => ({
          field,
          value: keyValue[field],
        }))
        props.renderItem = (item, i) => this.renderHashItem(item, i)
        
        break
      case 'set':
        break
      case 'zset':
        break
      case 'list':
        props.dataSource = keyValue
        props.renderItem = item => this.renderListItem(item)
        break
      default:
        return
    }
    
    return (
      <Col className="key-fields" span={6}>
        <List {...props} />
      </Col>
    )
  }

  renderValue() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    
    return (
      <Col className="fields-value" span={18}>
        <Form layout="inline" className="fields-value-form">
          <Form.Item className="fields-value">
            {
              getFieldDecorator('keyValue')(
                <TextArea
                  autosize={{
                    minRows: 28,
                    maxRows: 28,
                  }}
                />
              )
            }
          </Form.Item>

          <Form.Item>
            <Button type="primary">Submit</Button>
          </Form.Item>
        </Form>
      </Col>
    )
  }
  
  renderDetail() {
    return(
      <Col className="key-detail" span={18}>
        {this.renderFields()}
        {this.renderValue()}
      </Col>
    ) 
  }

  renderEmpty() {
    return (
      <div></div>
    )
  }

  render() {
    const {
      key,
    } = this.getSelectInfo()

    return !key ? this.renderEmpty() : this.renderDetail()
  }
}

export default withRouter(connect(state =>  ({
  global: state.global,
  redis: state.redis,
}))(Form.create({name: 'redis_detail'})(Detail)))
