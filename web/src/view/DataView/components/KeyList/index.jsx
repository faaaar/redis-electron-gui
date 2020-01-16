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
        const selected = item.key === props.value.key

        return (
          <Tooltip mouseEnterDelay={0.5} title={item.key}>
            <ListItem
              className={selected ? 'selected' : ''}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexFlow: 'row nowrap',
              }}
              onClick={() => onSelect(item)}
            >
              <p>
                <span style={{ backgroundColor }} className="type">
                  {item.type}
                </span>
                <span className="key">
                  {item.key}
                </span>
              </p>
            </ListItem>
          </Tooltip>
        )
      }}
    />
  )
}

export default KeyList
