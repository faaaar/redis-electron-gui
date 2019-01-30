import React from 'react'
import { Tree, Button, Modal, Input, Select } from 'antd'
import AddKeyModal from './AddKeyModal'

import { WithRedis } from './context'

const { Option } = Select
const { TreeNode } = Tree

export default WithRedis(class RedisKey extends React.Component {
  render() {
    const selectedRedis = this.props.data.selectedRedis
    if(!selectedRedis) {
      return <div />
    }

    const searchData = this.props.data.searchData
    
    return(
      <div className='redis-key-list'>
        <Tree
          defaultExpandAll
          selectedKeys={[this.props.data.selectedKey]}
          onSelect={this.props.data.SelectNode.bind(this)}
        >
          <TreeNode title="ROOT">
            {
              searchData.map(v => (
                <TreeNode isLeaf key={v} title={v} />
              ))
            }
          </TreeNode>
        </Tree>
        <Button
          className="add-key-btn" 
          type="primary"
          shape="circle"
          size="large"
          icon="plus">
        </Button>
      </div>
    )
  }
})
