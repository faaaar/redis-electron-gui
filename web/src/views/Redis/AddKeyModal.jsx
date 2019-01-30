import React from 'react'
import { Tree, Button, Modal, Input, Select } from 'antd'
import { WithRedis } from './context'

const InputGroup = Input.Group;
const { Option } = Select
const { TreeNode } = Tree

export default class extends React.Component {
  state = {
    valueType: 'string',
    valueKey: '',
    valueData: null,
  }
  
  showAddKeyModal() {
    this.setState({
      addKeyModalVisible: true,
    })
  }

  addKeyModalCancel() {
    this.setState({ 
      addKeyModalVisible: false,
    });
  }
  
  async addKeyModalOk() {
    this.setState({
      addKeyModalConfirmLoading: true,
    })

    setTimeout(() => {
      this.setState({
        addKeyModalConfirmLoading: false,
        addKeyModalVisible: false,
      });
    }, 2000)
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
  
  render() {
    const {
      valueType,
    } = this.state
    
    return(
      <div className="add-redis-key-modal">
        {/* <Button */}
        {/*   className="add-key-btn" */}
        {/*   onClick={() => this.showAddKeyModal()} */}
        {/*   type="primary" */}
        {/*   shape="circle" */}
        {/*   size="large" */}
        {/*   icon="plus"> */}
        {/* </Button> */}
        
        <Modal
          destroyOnClose={true}
          title="Add Redis Key"
          visible={this.state.addKeyModalVisible}
          onOk={() => this.addKeyModalOk()}
          confirmLoading={this.state.addKeyModalConfirmLoading}
          onCancel={() => this.addKeyModalCancel()}
        >
          <InputGroup compact>
            <Select
              style={{ width: '20%' }}
              onSelect={valueType => {this.onValueTypeSelect(valueType)}}
              value={this.state.valueType}
            >
              <Option value="string">String</Option>
              <Option value="hash">Hash</Option>
              <Option value="list">List</Option>
              <Option value="set">Set</Option>
              <Option value="zset">ZSet</Option>
            </Select>
            
            <Input
              style={{ width: '80%' }}
              value={this.state.valueKey}
              placeholder="redis key"
              onChange={e => this.onValueKeyChange(e.target.value)}
            />
          </InputGroup>
        </Modal>
      </div>
    )
  }
}
