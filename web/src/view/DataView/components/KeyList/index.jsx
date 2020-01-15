import React, { useState } from 'react'
import { List, Input, Icon, Tooltip } from 'antd'


const getRedisKeys = (keys, filter) => {
  const filterArray = filter.split(' ')

  filterArray.forEach(filter => {
    const nextKeys = [];

    for (var i = 0; i < keys.length; i++) {
      if (keys[i].key.match(filter) != null) {
        nextKeys.push(keys[i]);
      }
    }
    keys = nextKeys
  })
  
  return keys.slice(0, 100)
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
        return (
          <Tooltip mouseEnterDelay={0.5} title={item.key}>
            <List.Item
              style={{cursor: "pointer"}}
              onClick={e => onSelect(item)}
            >
              <span>{item.type}</span>
              <span>{item.key}</span>
            </List.Item>
          </Tooltip>
        )
      }}
    />
  )
}

export default KeyList
