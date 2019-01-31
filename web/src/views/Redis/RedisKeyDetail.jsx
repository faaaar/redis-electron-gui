import React from 'react'
import { Button, Select, Table, Input } from 'antd'
import { WithRedis } from './context'

const ButtonGroup = Button.Group
const InputGroup = Input.Group
const Option = Select.Option

export default WithRedis(class RedisKey extends React.Component {
  renderHash() {
    const {
      currentData,
    } = this.props.data
    if (!currentData) {
      return 
    }
    const columns = [{
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    }, {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (text, record, index) => {
        return (
          <ButtonGroup>
            <Button type="danger">Delete</Button>
            <Button type="primary">Edit</Button>
          </ButtonGroup>
        )
      }
    }]
    const dataSource = Object.keys(currentData).map(key => ({key, value: currentData[key]}) )
    
    return (
      <Table
        pagination={{
          hideOnSinglePage: true,
        }}
        style={{marginTop: 24}}
        dataSource={dataSource}
        columns={columns}
      />
    )
  }
  
  renderString() {
    const {
      currentData,
      ipcSetStringKey,
      updateState,
    } = this.props.data
    
    return (
      <div className="redis-string">
        <textarea
          onChange={e => updateState({
            currentData: e.target.value,
          })}
          className="redis-data-value"
          value={currentData} />
        <Button
          onClick={() => ipcSetStringKey()}
          type="primary">
          Save
        </Button>
      </div>
    )
  }

  onValueTypeSelect(valueType) {
    this.setState({
      valueType,
    })
  }

  onValueKeyChange(valueKey) {
    this.setState({
      valueKey,
    })
  }
  
  renderHeader() {
    const {
      currentRedis,
      currentKey,
      currentType,
      currentTTL,
      ipcDeleteRedisKey,
      updateState,
      isAddData,
    } = this.props.data

    return (
      <React.Fragment>
        <p>Current Status: {this.props.data.isAddData ? 'New' : 'View'}</p> 
        <div className="redis-detail-header">
          <div className="line-1">
            <InputGroup compact>
              <Select
                disabled={!isAddData}
                onSelect={currentType => updateState({
                  currentType,
                })}
                style={{width: "15%"}}
                value={currentType}
              >
                <Option value="string">String</Option>
                <Option value="hash">Hash</Option>
                <Option value="list">List</Option>
                <Option value="set">Set</Option>
                <Option value="zset">ZSet</Option>
              </Select>
              <Input
                disabled={!isAddData}
                placeholder="Redis Key"
                onChange={e => updateState({
                  currentKey: e.target.value
                })}
                style={{width: "30%"}}
                value={currentKey}
              />
              <Input
                placeholder="Redis Key TTL"
                onChange={e => updateState({
                  currentTTL: e.target.value,
                })}
                style={{width: "15%"}}
                value={currentTTL}
              />
              
              <ButtonGroup style={{width: "40%"}}>
                <Button type="danger" onClick={() => ipcDeleteRedisKey()}>Delete</Button>
                <Button type="primary">Rename</Button>
                <Button type="primary">Reload</Button>
                <Button type="primary">Set TTL</Button>
              </ButtonGroup>
            </InputGroup>
          </div>
        </div>
      </React.Fragment>
    )
  }
  
  render() {
    const {
      currentType,
    } = this.props.data
    
    let renderFunc = () => {}

    switch(currentType) {
      case 'string':
        renderFunc = this.renderString.bind(this)
        break
      case 'hash':
        renderFunc = this.renderHash.bind(this)
        break
      default:
        renderFunc = () => {}
    }
    
    return(
      <div className='redis-key-detail'>
        {this.renderHeader()}
        {renderFunc()}
      </div>
    )
  }
})
