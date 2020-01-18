import React from 'react'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
} from 'antd'

const FormItem = Form.Item
const { Option } = Select

const TypeRules = [{
  message: 'The input is not valid type',
}, {
  required: true,
  message: 'Please select correct type',
}]


const KeyRules = [{
  required: true,
  message: 'Please input your expire',
}]

const ExpireRules = [{
  message: 'The input is not valid expire',
  pattern: /^-?[0-9]+$/,
}, {
  required: true,
  message: 'Please input your expire',
}]

const ScoreRules = [{
  message: 'The input is not valid score',
  pattern: /^[0-9]+$/,
}, {
  required: true,
  message: 'Please input your score',
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

const _hasField = [ 'hash' ]
const _hasValue = [ 'string', 'hash', 'list' ]
const _hasScore = [ 'zset' ]
const _hasMember = [ 'zset', 'set' ]

const CreateKeyModal = props => {
  const { getFieldDecorator, getFieldValue } = props.form
  const FormItemList = []
  const type = getFieldValue('type')

  FormItemList.push(
    <FormItem key="type" {...formItemLayout} label="Type">
      {getFieldDecorator('type', { rules: TypeRules, initialValue: '' })(
        <Select>
          <Option value="string">String</Option>
          <Option value="hash">Hash</Option>
          <Option value="list">List</Option>
          <Option value="set">Set</Option>
          <Option value="zset">ZSet</Option>
        </Select>
      )}
    </FormItem>
  )

  if (type) {
    // --------- KEY ---------
    FormItemList.push(
      <FormItem key="key" {...formItemLayout} label="Key">
        {getFieldDecorator('key', { rules: KeyRules, initialValue: '' })(<Input />)}
      </FormItem>
    )

    // --------- EXPIRE ---------
    FormItemList.push(
      <FormItem key="expire" {...formItemLayout} label="Expire">
        {getFieldDecorator('expire', { rules: ExpireRules, initialValue: -1 })(<Input />)}
      </FormItem>
    )

    // --------- FIELD ---------
    if (_hasField.indexOf(type) !== -1) {
      FormItemList.push(
        <FormItem key="field" {...formItemLayout} label="Field">
          {getFieldDecorator('field', { rules: FieldRules, initialValue: '' })(<Input />)}
        </FormItem>
      )
    }


    // --------- MEMBER ---------
    if (_hasMember.indexOf(type) !== -1) {
      FormItemList.push(
        <FormItem key="member" {...formItemLayout} label="Member">
          {getFieldDecorator('member', { rules: ValueRules, initialValue: '' })(<Input />)}
        </FormItem>
      )
    }

    // --------- SCORE ---------
    if (_hasScore.indexOf(type) !== -1) {
      FormItemList.push(
        <FormItem key="score" {...formItemLayout} label="Score">
          {getFieldDecorator('score', { rules: ScoreRules, initialValue: 0 })(<Input />)}
        </FormItem>
      )
    }

    // --------- VALUE ---------
    if (_hasValue.indexOf(type) !== -1) {
      FormItemList.push(
        <FormItem key="value" {...formItemLayout} label="Value">
          {getFieldDecorator('value', { rules: ValueRules, initialValue: '' })(<Input />)}
        </FormItem>
      )
    }
  }

  return (
    <div className="conn-view">
      <Row className="container">
        <Col className="config-panel" span={24}>

          <Form className="config-form">

            {FormItemList}

            <FormItem {...formItemLayout} colon={false} className="form-btn" label=" ">
              <Button
                onClick={() => {
                  const fieldsValue = { ...props.form.getFieldsValue() }

                  props.form.validateFieldsAndScroll(err => {
                    if (!err) {
                      props.submit(fieldsValue)
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
