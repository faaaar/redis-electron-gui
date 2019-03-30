import React from 'react'
import { Select, Input } from 'antd';
import { WithRedis } from './context'

const Option = Select.Option;
const Search = Input.Search

export default WithRedis(class  extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  renderRedisList() {
    const redisConnect = this.props.data.config.connect

    if (!redisConnect) {
      return 
    }

    return (
      <React.Fragment>
        <Select
          value={this.props.data.currentRedis}
          placeholder='Select a redis'
          style={{ width: "100%" }}
          onChange={currentRedis => this.props.data.updateState({
            currentRedis,
          })}
        >
          {
            Object.keys(redisConnect).map((v, i) => (
              <Option value={v} key={v}>{v}</Option>
            ))
          }
        </Select>
      </React.Fragment>
    )
  }

  renderRedisSearch() {
    return (
      <Search
        onChange={e => this.props.data.updateState({
          searchKey: e.target.value,
        })}
        value={this.props.data.searchKey}
        placeholder="input search text"
        onSearch={value => this.props.data.ipcSearchRedis(value)}
        enterButton
      />
    )
  }
  
  render() {
    return(
      <div className="option-list">
        <div className="option-item">
          {this.renderRedisList()}
        </div>
        <div className="option-item">
          {this.renderRedisSearch()}
        </div>
      </div>
    )
  }
})


