import React from 'react'
import { connect } from 'react-redux'

import {
  Row,
  Col,
  List,
} from 'antd';

import './index.scss'

export default connect(state => ({
  global: state.global,
}))(class extends React.Component {
  constructor(props) {
    super(props)
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
      <div className="conn-view">
        <Row className="container">
          <Col className="save-conn" span={6}>
            <Row className="tree">
              <List
                size="small"
                header={<div className="list-header">QUICK CONN</div>}
                bordered
                dataSource={data}
                renderItem={item => (<List.Item>{item}</List.Item>)}
              />
            </Row>
          </Col>
          <Col className="config-panel" span={18}>
            
          </Col>
        </Row>
      </div>
    )
  }
})
