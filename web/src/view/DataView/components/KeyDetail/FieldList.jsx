import React from 'react'
import { List, Icon } from 'antd'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

const ListItem = List.Item

const FieldList = props => {
  if (!props.show) {
    return <></>
  }

  const [ value, setValue ] = props.value
  const [ _value, _setValue ] = props._value
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
      renderItem={(item, idx) => {
        let selected = false
        const key = value.key

        switch (type) {
          case 'list':
            selected = idx === value.idx
            break
          case 'hash':
            selected = item === value.field
            break
          case 'set':
            selected = item === _value.member
            break
          case 'zset':
            selected = item === value.member
            break
          default:
            break
        }

        return (
          <>
            <ContextMenuTrigger id={`${key}-${idx}`}>
              <ListItem
                className={selected ? 'selected' : ''}
                onClick={() => {
                  const nextValue = { ...value }
                  const _nextValue = { ..._value }
                  const set = (k, v) => {
                    nextValue[k] = v
                    _nextValue[k] = v
                  }

                  switch (type) {
                    case 'zset':
                      set('member', item)
                      set('score', value.values[item])
                      break
                    case 'list':
                      set('idx', idx)
                      set('value', item)
                      break
                    case 'set':
                      set('member', item)
                      set('idx', idx)
                      break
                    case 'hash':
                      set('field', item)
                      set('value', values[item])
                      break
                    default:
                      console.error('NO THIS TYPE')
                  }

                  _setValue(_nextValue)
                  setValue(nextValue)
                }}
              >
                <p><span className="text">{item}</span></p>
              </ListItem>
            </ContextMenuTrigger>
            <ContextMenu id={`${key}-${idx}`}>
              <MenuItem
                onClick={() => props.deleteField({
                  key,
                  type,
                  idx,
                  item,
                })}
              >
                <span className="text">Delete</span>
                <span className="icon"><Icon type="delete" /></span>
              </MenuItem>
            </ContextMenu>
          </>
        )
      }}
    />
  )
}

export default FieldList
