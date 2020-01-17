import React from 'react'
import { Col, Row } from 'antd'
import FieldList from './FieldList'
import ValueDetail from './ValueDetail'
import KeyHeader from './KeyHeader'

import './index.scss'

const KeyDetail = props => {
  const [value, setValue] = props.data
  const [_value, _setValue] = props._data
  const type = value.type
  const showField = type !== 'string'
  const contentWidth = showField ? 18 : 24

  return (
    <Row className="app-key-detail">
      <Col>
        <KeyHeader
          newKey={() => props.newKey()}
          deleteKey={() => props.deleteKey()}
          saveValue={type => props.saveValue(type)}
          value={[value, setValue]}
          _value={[_value, _setValue]}
        />
      </Col>
      <Col>
        <Row className="detail-container">
          <Col span={6}>
            <FieldList
              value={[value, setValue]}
              _value={[_value, _setValue]}
              show={showField}
            />
          </Col>
          <Col span={contentWidth} className="value">
            <ValueDetail
              value={[value, setValue]}
              deleteField={() => props.deleteField()}
              saveValue={() => props.saveValue('normal')}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default KeyDetail
