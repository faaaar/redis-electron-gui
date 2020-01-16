import React from 'react'
import { Col, Row } from 'antd'
import FieldList from './FieldList'
import ValueDetail from './ValueDetail'

import './index.scss'

const DetailHeader = props => {
  if (props.show) {
    return <></>
  }

  return (
    <Col className="detail-header">

    </Col>
  )
}

const KeyDetail = props => {
  const [value, setValue] = props.data
  const type = value.type
  const showField = type !== 'string'
  const contentWidth = showField ? 18 : 24

  return (
    <Row className="app-key-detail">
      <DetailHeader />
      <Col>
        <Row className="detail-container">
          <Col span={6}>
            <FieldList value={[value, setValue]} show={showField} />
          </Col>
          <Col span={contentWidth} className="value">
            <ValueDetail
              value={[value, setValue]}
              deleteField={() => props.deleteField()}
              saveValue={() => props.saveValue()}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default KeyDetail
