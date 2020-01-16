import React from 'react'
import { List } from 'antd'

const ListItem = List.Item

const FieldList = props => {
  if (!props.show) {
    return <></>
  }

  const [ value, setValue ] = props.value
  const values = value.values
  const fieldList = value.fieldList || []
  const memberList = value.memberList || []
  const type = value.type
  let list = []
  switch(type) {
    case 'set':
    case 'zset':
      list = memberList
      break
    default:
      list = fieldList
      break
  }

  return (
    <List
      className="field-list"
      bordered
      dataSource={list}
      renderItem={item => {
        let selected = false

        switch (type) {
          case 'list':
          case 'hash':
            selected = item === value.field
            break
          case 'set':
          case 'zset':
            selected = item === value.member
            break
          default:
            break
        }

        return (
          <ListItem
            className={selected?'selected':''}
            onClick={() => {
              const nextValue = { ...value }

              switch (type) {
                case 'zset':
                  nextValue.member = item
                  nextValue.score = value.values[item]
                  break
                case 'list':
                  nextValue.field = item
                  nextValue.value = item
                  break
                case 'set':
                  nextValue.member = item
                  break
                case 'hash':
                  nextValue.field = item
                  nextValue.value = values[item]
                  break
                default:
                  console.error('NO THIS TYPE')
              }

              setValue(nextValue)
            }}
          >
            <p><span className="text">{item}</span></p>
          </ListItem>
        )
      }}
    />
  )
}

export default FieldList
