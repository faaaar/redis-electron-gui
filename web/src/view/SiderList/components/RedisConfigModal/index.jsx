import React from 'react'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
} from 'antd'

const FormItem = Form.Item

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

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

const RedisConfigModal = props => {
  const { getFieldDecorator } = props.form

  return (
    <div className="conn-view">
      <Row className="container">
        <Col className="config-panel" span={24}>
          <Form className="config-form">
            <FormItem {...formItemLayout} label="Alias">
              {getFieldDecorator('alias', { rules: AliasRules, initialValue: props.data.alias })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Host">
              {getFieldDecorator('host', { rules: HostRules, initialValue: props.data.host })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Port">
              {getFieldDecorator('port', { rules: PortRules, initialValue: props.data.port })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Auth">
              {getFieldDecorator('auth', { rules: AuthRules, initialValue: props.data.auth })(<Input type="password" />)}
            </FormItem>

            <FormItem {...formItemLayout} colon={false} className="form-btn" label=" ">
              <Button
                onClick={() => {
                  const { alias } = props.form.getFieldsValue()
                  const fieldsValue = { ...props.form.getFieldsValue() }

                  props.form.validateFieldsAndScroll(err => {
                    if (!err) {
                      if (props.isEdit) {
                        Modal.confirm({
                          title: `The \`${alias}\` will be changed`,
                          content: 'continue?',
                          onOk() {
                            props.submit(fieldsValue)
                          },
                          onCancel() {},
                        })
                      } else {
                        props.submit(fieldsValue)
                      }
                    }
                  })
                }}
              >
                确定
              </Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Form.create({
  name: 'redis_config_modal',
})(RedisConfigModal)
