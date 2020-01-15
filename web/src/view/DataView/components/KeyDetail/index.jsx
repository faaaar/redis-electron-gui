import React from 'react'
import {
  Row,
  Col,
  List,
  Input,
  Icon,
  Button,
} from 'antd'

import './index.scss'

const ListItem = List.Item
const TextArea = Input.TextArea

const DetailHeader = props => {
  if (props.show) {
    return <></>
  }

  return (
    <Col className="detail-header">

    </Col>
  )
}

const Field = props => {
  if (!props.show) {
    return <></>
  }

  const [value] = props.value
  const fieldList = value.fieldList || []
  const memberList = value.memberList || []
  const type = value.type
  let list = []
  switch(type) {
    case "zset":
      list = memberList
      break
    default:
      list = fieldList
      break
  }
  return (
    <Col span={6}>
      <List
        className="field-list"
        size="small"
        bordered
        dataSource={list}
        renderItem={item => {
          return (
            <ListItem onClick={e => props.onSelect(item)}>
              <p>
                <span className="text">{item}</span>
                <span
                  className="delete"
                  onClick={e => {
                    e.stopPropagation()
                  }}
                >
                  <Icon type="delete"/>
                </span>
              </p>              
            </ListItem>
          )
        }}
      />
    </Col>
  )
}

const Value = props => {  
  const width = props.width
  const [value, setValue] = props.value
  const type = value.type

  console.log(value)
  let v = ""
  let updateFunc = () => {}
  
  switch(type) {
    case "zset":
      v = value.score
      updateFunc = score => setValue({ ...value, score })
      break
    default:
      v = value.value
      updateFunc = v => setValue({ ...value, value: v })
  }
  
  return (
    <Col
      span={width}
      className="value"
    >
      <TextArea
        onChange={e => updateFunc(e.target.value)}
        autoSize={{
          minRows: 10,
        }}
        value={v}
      />

      <Button onClick={() => props.save()}>
        保存
      </Button>
    </Col>
  )
}

const KeyDetail = props => {
  const [value, setValue] = props.data
  const values = value.values
  const type = value.type
  const showField = type !== 'string'
  const contentWidth = showField ? 18 : 24
  
  return (
    <Row className="app-key-detail">
      <DetailHeader />
      <Col>
        <Row className="detail-container">
          <Field
            onSelect={v => {
              const nextValue = { ...value }                         
              
              switch (type) {
                case "zset":
                  nextValue.member = v
                  nextValue.score = value.values[v]
                  break
                case "list":
                case "set":
                  nextValue.field = v
                  nextValue.value = v
                  break
                case "hash":
                  nextValue.field = v
                  nextValue.value = values[v]
                  break
                default:
                  console.error("NO THIS TYPE")
              }

              setValue(nextValue) 
            }}
            value={[value, setValue]}
            show={showField}
          />
          <Value
            width={contentWidth}
            value={[value, setValue]}
            save={() => props.save()}
          />
        </Row>
      </Col>
    </Row>   
  )
}

export default KeyDetail
