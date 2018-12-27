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

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  renderRedisList() {
    const redisConnect = this.props.data.config.connect

    if (!redisConnect) {
      return 
    }

    return (
      <Select
        value={this.props.data.selectedRedis}
        placeholder='Select a redis'
        style={{ width: 200 }}
        onChange={value => this.props.data.SelectRedis(value)}>
        {
          Object.keys(redisConnect).map((v, i) => (
            <Option value={v} key={v}>{v}</Option>
          ))
        }
      </Select>
    )
  }

  renderRedisSearch() {
    return (
      <Search
        defaultValue={this.props.data.searchKey}
        placeholder="input search text"
        onSearch={value => this.props.data.SearchRedis(value)}
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


