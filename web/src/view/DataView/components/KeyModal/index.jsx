import React, { useState } from 'react'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  Select,
} from 'antd'

const FormItem = Form.Item
const { Option } = Select

const TypeRules = [{
  message: 'The input is not valid alias',
}, {
  required: true,
  message: 'Please select correct type',
}]

const ExpireRules = [{
  message: 'The input is not valid alias',
}, {
  required: true,
  message: 'Please input your alias',
  pattern: /^-?[0-9]+$/,
}]

const FieldRules = [{
  message: 'The input is not valid host',
}, {
  required: true,
  message: 'Please input your host',
}]

const ValueRules = [{
  message: 'The input is not valid host',
}, {
  required: true,
  message: 'Please input your host',
}] 

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

const CreateKeyModal = props => {
  const { getFieldDecorator } = props.form
  const initData = {}

  const [type, setType] = useState('string')
  
  return (
    <div className="conn-view">
      <Row className="container">
        <Col className="config-panel" span={24}>
          <Form className="config-form">
            <FormItem {...formItemLayout} label="Type">
              {getFieldDecorator('type', { rules: TypeRules, initialValue: 'string' })( 
                <Select>
                  <Option value="string">String</Option>
                  <Option value="hash">Hash</Option>
                  <Option value="list">List</Option>
                  <Option value="set">Set</Option>
                  <Option value="zset">ZSet</Option>
                </Select>
              )}
            </FormItem>
            
            <FormItem {...formItemLayout} label="Expire">
              {getFieldDecorator('expire', { rules: ExpireRules, initialValue: -1 })(<Input type="number" />)}
            </FormItem>
       
            <FormItem {...formItemLayout} label="Field">
              {getFieldDecorator('field', { rules: FieldRules, initialValue: '' })(<Input />)}
            </FormItem>
            
            <FormItem {...formItemLayout} label="Value">
              {getFieldDecorator('value', { rules: ValueRules, initialValue: '' })(<Input />)}
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
  name: 'redis_key_modal',
})(CreateKeyModal)
