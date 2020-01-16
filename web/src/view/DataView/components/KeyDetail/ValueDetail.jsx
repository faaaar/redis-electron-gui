import React from 'react'
import { Input, Button } from 'antd'
const TextArea = Input.TextArea

const ValueDetail = props => {
  const [ value, setValue ] = props.value
  const type = value.type

  let v = ''
  let updateFunc = () => {}

  switch(type) {
    case 'zset':
      v = value.score
      updateFunc = score => setValue({ ...value, score })
      break
    case 'set':
      v = value.member
      updateFunc = member => setValue({ ...value, member })
      break
    default:
      v = value.value
      updateFunc = v => setValue({ ...value, value: v })
      break
  }

  return (
    <>
      <TextArea
        onChange={e => updateFunc(e.target.value)}
        autoSize={{ minRows: 10 }}
        value={v}
      />

      <Button onClick={() => props.saveValue()}>保存</Button>
      <Button onClick={() => props.deleteField()}>删除</Button>
    </>
  )
}

export default ValueDetail
