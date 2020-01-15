import React, { useState } from 'react'
import { List, Input, Icon, Tooltip } from 'antd'
import './index.scss'

const ListItem = List.Item

const getRedisKeys = (keys, filter) => {
  const filterArray = filter.split(' ')

  filterArray.forEach(filter => {
    const nextKeys = []

    for (var i = 0; i < keys.length; i++) {
      if (keys[i].key.match(filter) != null) {
        nextKeys.push(keys[i])
      }
    }
    keys = nextKeys
  })
  
  return keys.slice(0, 100)
}

const colorSet = {
  'string': 'blue',
  'hash': 'green',
  'set': '#D57',
  'zset': 'red',
  'list': 'orange',
}

const KeyList = props => {
  const loading = props.loading
  const onSearch = props.onSearch
  const onSelect = props.onSelect
  const [searchKey, setSearchKey] = useState('')
  const [filterKey, setFilterKey] = useState('')
  
  const data = getRedisKeys(props.data, filterKey)
  
  return (
    <List
      className="app-key-list"
      loading={loading}
      size="small"
      bordered
      dataSource={data}
      header={
        <>       
          <div>
            <Input
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
              type="text"
              placeholder="Key name, support regexp."
              prefix={<Icon type="search" />}
              onPressEnter={() => onSearch(searchKey)}
            />
          </div>
          <div>
            <Input
              value={filterKey}
              onChange={e => setFilterKey(e.target.value)}
              type="text"
              placeholder="Key name, support regexp."
              prefix={<Icon type="filter" />}
            />
          </div>
        </>
      }
      renderItem={item => {
        const backgroundColor = colorSet[item.type]
        return (
          <Tooltip mouseEnterDelay={0.5} title={item.key}>
            <ListItem
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexFlow: 'row nowrap',
              }}
              onClick={e => onSelect(item)}
            >
              <span
                style={{
                  backgroundColor,
                  width: '15%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: '28px',
                  borderRadius: '16px',
                  color: '#fff',
                  fontWeight: '700',
                  marginRight: '4px',
                  minWidth: '50px',
                }}
              >
                {item.type}
              </span>
              <span
                style={{
                  width: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.key}
              </span>
            </ListItem>
          </Tooltip>
        )
      }}
    />
  )
}

export default KeyList
