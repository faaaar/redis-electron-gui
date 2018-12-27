import React from 'react'
import { Button, Select } from 'antd';
import { WithRedis } from './context'

const ButtonGroup = Button.Group;
const Option = Select.Option;


export default WithRedis(class RedisKey extends React.Component {
  renderHash() {

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

  renderHeader() {
    const {
      selectedKey,
      selectedType,
    } = this.props.data

    return (
      <div className="redis-detail-header">
        <div className="line-1">
          <span className="key-type">{selectedType}</span>
          <span className="key-name">{selectedKey}</span>
          <span className="key-ttl">TTL: -1</span>

          <Select
            style={{width: 120}}
            defaultValue="text">
            <Option value="text">TEXT</Option>
            <Option value="json">JSON</Option>
          </Select>
          <ButtonGroup>
            <Button type="danger">Delete</Button>
            <Button type="primary">Rename</Button>
            <Button type="primary">Reload</Button>
            <Button type="primary">Set TTL</Button>
          </ButtonGroup>
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

    console.log(selectedKey)
    console.log(selectedData)
    console.log(selectedType)
    console.log('----------------------')
    
    let renderFunc = () => {}

    switch(selectedType) {
      case 'string':
        renderFunc = this.renderString.bind(this)
        break
      case 'hash':
        renderFunc = this.renderHash
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
