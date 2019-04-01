import React from 'react'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  Input,
  List,
  Select,
  Button,
} from 'antd'

import {
  SearchRedisKeyByFilter,
} from '../../actions/redis'

import './index.scss'

const Option = Select.Option

let searchTicker = null

class DataView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filter: '*',
    }
  }
  onFilterChanged(e) {
    const filter = e.target.value

    this.setState({
      filter,
    })
  }
  
  renderKeyListFooter() {
    return (
      <Row className="list-footer">
        <Col>
          <Select defaultValue="0">
            <Option value="0">0</Option>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="10">10</Option>
            <Option value="11">11</Option>
            <Option value="12">12</Option>
            <Option value="13">13</Option>
            <Option value="14">14</Option>
            <Option value="15">15</Option>
            <Option value="16">16</Option>
          </Select>
        </Col>
      </Row>
    )
  }

  getRouterParam(key) {
    return this.props.match.params[key]
  }

  onClickToSearch() {
    SearchRedisKeyByFilter(this.state.filter)
  }
  
  renderKeyListHeader() {
    return (
      <div className="list-header">
        <Input
          value={this.state.filter}
          onChange={e => this.onFilterChanged(e)}
          type="text"
          placeholder="Key name, support regexp."
        />
        <Button
          type="primary"
          onClick={() => this.onClickToSearch()}
        >
          Search
        </Button>
      </div>
    )
  }

  renderKeyListItem(item) {
    return (
      <List.Item className="list-item">
        {item}
      </List.Item>
    )
  }
  
  render() {
    const data = [
      'Racing car sprays burning fuel into crowd.',
      'Japanese princess to wed commoner.',
      'Australian walks 100km after outback crash.',
      'Man charged over missing wedding girl.',
      'Los Angeles battles huge wildfires.', 
    ];
    
    return (
      <div className="data-view">
        <Row className="container">
          <Col className="key-tree" span={6}>
            <List
              className="key-list"
              size="small"
              header={this.renderKeyListHeader()}
              bordered
              dataSource={data}
              renderItem={item => this.renderKeyListItem(item)}
            />
            {this.renderKeyListFooter()}
          </Col>
          <Col className="key-detail" span={18}>
            <Col className="key-fields" span={6}></Col>
            <Col className="fields-value" span={18}></Col>
          </Col>
        </Row>
      </div>
    )
  }
} 

export default connect(state => ({
  global: state.global,
  redis: state.redis,
}))(DataView)
