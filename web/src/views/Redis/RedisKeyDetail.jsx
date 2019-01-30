import React from 'react'
import { Button, Select, Table, Input } from 'antd'
import { WithRedis } from './context'

const ButtonGroup = Button.Group
const InputGroup = Input.Group
const Option = Select.Option

export default WithRedis(class RedisKey extends React.Component {
  renderHash() {
    const {
      selectedKey,
      selectedData,
      selectedRedis,
      UpdateRedisStringKey,
    } = this.props.data
    
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
    const dataSource = Object.keys(selectedData).map(key => ({key, value: selectedData[key]}) )
    
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
      selectedKey,
      selectedData,
      selectedRedis,
      UpdateRedisStringKey,
    } = this.props.data
    
    return (
      <div className="redis-string">
        <h1>render string</h1>
        <textarea
          ref="J_textArea"
          className="redis-data-value"
          defaultValue={selectedData} />
        <Button
          onClick={() => UpdateRedisStringKey(selectedRedis, selectedKey, this.refs.J_textArea.value)}
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
      selectedRedis,
      selectedKey,
      selectedType,
      isAddData,
      addData,
      DeleteRedisKey,
      UpdateAddValue,
    } = this.props.data

    return (
      <div className="redis-detail-header">
        <div className="line-1">
          <InputGroup compact>
            <Select
              onSelect={valueType => UpdateAddValue('valueType', valueType)}
              style={{width: "15%"}}
              value={isAddData ? addData['valueType'] : selectedType}
            >
              <Option value="string">String</Option>
              <Option value="hash">Hash</Option>
              <Option value="list">List</Option>
              <Option value="set">Set</Option>
              <Option value="zset">ZSet</Option>
            </Select>
            <Input
              placeholder="Redis Key"
              onChange={e => UpdateAddValue('valueKey', e.target.value)}
              style={{width: "30%"}}
              value={isAddData ? addData['valueKey'] : selectedKey}
            />
            <Input
              placeholder="Redis Key TTL"
              onChange={e => UpdateAddValue('ttl', e.target.value)}
              style={{width: "15%"}}
              value={isAddData ? addData['ttl'] : ''}
            />
            
            <ButtonGroup style={{width: "40%"}}>
              <Button type="danger" onClick={() => DeleteRedisKey(selectedRedis, selectedKey)}>Delete</Button>
              <Button type="primary">Rename</Button>
              <Button type="primary">Reload</Button>
              <Button type="primary">Set TTL</Button>
            </ButtonGroup>
          </InputGroup>
        </div>
      </div>
    )
  }
  
  render() {
    const {
      selectedKey,
      selectedData,
      selectedType,
    } = this.props.data
    
    let renderFunc = () => {}

    switch(selectedType) {
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
