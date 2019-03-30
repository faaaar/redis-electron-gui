import React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  List,
  Form,
  Input,
  Button,
  Modal,
} from 'antd';
import {
  ConnectToRedis,
} from '../../actions/redis'

import {
  AddConnectConfig,
  DelConnectConfig,
} from '../../actions/global'

import './index.scss'

const FormItem = Form.Item
const ButtonGroup = Button.Group

const AliasRules = [{
  message: 'The input is not valid alias',
}, {
  required: true,
  message: 'Please input your alias',
  
}]

const HostRules = [{
  message: 'The input is not valid host',
}, {
  required: true,
  message: 'Please input your host',
  pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
}]

const PortRules = [{
  message: 'The input is not valid port',
}, {
  required: true,
  message: 'Please input your port',
  pattern: /^[0-9]+$/,
}]

const AuthRules = [{
  message: 'The input is not valid auth',
}, {
  message: 'Please input your auth',
}]

const ADD_TO_FAVORITE = "ADD_TO_FAVORITE"
const CHANGE_FAVORITE = "CHANGE_FAVORITE"

class ConnView extends  React.Component {
  onClickConnectToRedis(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        ConnectToRedis({...this.props.form.getFieldsValue()})
      }
    });
  }

  updateConnectConfig(type) {
    const { alias } = this.props.form.getFieldsValue()
    
    const isChange = type === CHANGE_FAVORITE
    const connectConfig = this.getConnectConfig()
    const fieldsValue = {...this.props.form.getFieldsValue()}
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        if (isChange && connectConfig[alias]) {
          Modal.confirm({
            title: `The \`${alias}\` will be changed`,
            content: 'continue?',
            onOk() {
              AddConnectConfig(fieldsValue)
            },
            onCancel() {},
          })
        } else {
          AddConnectConfig(fieldsValue)
        }
      }
    })
  }

  getConnectConfig() {
    return  this.props.global.connectConfig || {}
  }

  onClickConnItem(e, alias) {
    const connectConfig = this.getConnectConfig()
    const config = connectConfig[alias]
    const {
      host,
      port,
      auth,
    } = config || {}

    this.props.form.setFieldsValue({
      host,
      port,
      auth,
      alias,
    })
  }

  onClickDelConfig() {
    const alias = this.props.form.getFieldValue('alias')
    if (!alias) {
      return
    }
    
    Modal.confirm({
      title: `The \`${alias}\` will be deleted`,
      content: `continue?`,
      onOk() {
        DelConnectConfig(alias)
      },
      onCancel() {},
    })
  }

  renderSaveBtn() {
    const connectConfig = this.getConnectConfig()
    const alias = this.props.form.getFieldValue("alias")
    const disabledChangeBtn = !connectConfig[alias]
    
    return (
      <Button
        disabled={disabledChangeBtn}
        type="danger"
        onClick={() => this.updateConnectConfig(CHANGE_FAVORITE)}
      >
        Save
      </Button>
    )
  }

  renderAddFavoriteBtn() {
    return (
      <Button
        type="primary"
        onClick={() => this.updateConnectConfig(ADD_TO_FAVORITE)}
      >
        Add
      </Button>
    )
  }

  renderConnectBtn() {
    return(
      <Button
        type="primary"
        onClick={e => this.onClickConnectToRedis(e)}
      >
        Connect
      </Button>
    )
  }

  renderDelBtn() {    
    return (
      <Button
        type="danger"
        onClick={() => this.onClickDelConfig()}
      >
        Delete
      </Button>
    )    
  }

  renderListHeader() {
    return (
      <div className="list-header">QUICK CONN</div>
    )
  }

  renderListItem(item) {
    const isSelectMe = this.props.form.getFieldValue('alias') === item
    
    return (
      <List.Item className={`list-item ${isSelectMe ? 'list-selected' : ''}`} onClick={e => this.onClickConnItem(e, item)}>
        {item}
      </List.Item>
    )
  }
  
  render() {
    const connectKeyList = Object.keys(this.getConnectConfig())
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    }
    
    return (
      <div className="conn-view">
        <Row className="container">
          <Col className="favorite-conn" span={6}>
            <Row className="tree">
              <List
                className="conn-list"
                size="small"
                header={this.renderListHeader()}
                bordered
                dataSource={connectKeyList}
                renderItem={item => this.renderListItem(item)}
              />
            </Row>
          </Col>
          <Col className="config-panel" span={18}>
            <Form className="config-form">
              <FormItem {...formItemLayout} label="Alias">
                {getFieldDecorator('alias', {rules: AliasRules, initialValue: ''})(<Input />)}
              </FormItem>
              
              <FormItem {...formItemLayout} label="Host">
                {getFieldDecorator('host', {rules: HostRules, initialValue: ''})(<Input />)}
              </FormItem>
              
              <FormItem {...formItemLayout} label="Port">
                {getFieldDecorator('port', {rules: PortRules, initialValue: ''})(<Input />)}
              </FormItem>
              
              <FormItem {...formItemLayout} label="Auth">
                {getFieldDecorator('auth', {rules: AuthRules})(<Input type="password" />)}
              </FormItem>
              
              <FormItem {...formItemLayout} colon={false} className="form-btn" label=" ">
                <ButtonGroup className="btn-group">
                  {this.renderAddFavoriteBtn()}
                  {this.renderSaveBtn()}
                  {this.renderDelBtn()}
                  {this.renderConnectBtn()}
                </ButtonGroup>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

const WrappedConnView = Form.create({
  name: 'horizontal_login',
})(ConnView);

export default connect(state => ({
  global: state.global,
  redis: state.redis,
}))(WrappedConnView)
