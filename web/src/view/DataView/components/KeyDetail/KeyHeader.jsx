import React from 'react'
import { } from '@action/redis'
import {
  Form,
  Icon,
  Input,
  Button,
} from 'antd'

const FormItem = Form.Item

const KeyHeader = props => {
  if (props.show) {
    return <></>
  }
  const [_value, _setValue] = props._value
  const [ value, setValue ] = props.value

  return (
    <div className="key-header">
      <Form layout="inline">
        <FormItem label="Key">
          <Input
            disabled
            value={_value.key}
            placeholder="Redis Key"
          />
        </FormItem>

        <FormItem label="TTL">
          <Input
            value={value.ttl}
            placeholder="TTL"
            type="number"
            onChange={e => setValue({ ...value, ttl: e.target.value })}
            onPressEnter={() => props.saveValue('ttl')}
          />
        </FormItem>

        <FormItem>
          <Button onClick={() => props.deleteKey()}>删除</Button>
        </FormItem>
        <FormItem>
          <Button onClick={() => props.newKey()}>新增</Button>
        </FormItem>
      </Form>
    </div>
  )
}

export default KeyHeader
