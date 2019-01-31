import React from 'react'
import { Tree, Button } from 'antd'

import { WithRedis } from './context'

const { TreeNode } = Tree

export default WithRedis(class RedisKey extends React.Component {
  async selectNode(keys, tree) {
    if (!tree.node.props.isLeaf || (!keys || !keys.length)) {
      return
    }

    const {
      currentRedis,
      ipcGetDataType,
      ipcGetData,
      updateState,
    } = this.props.data
    
    if (!currentRedis) {
      alert('请选择redis')
      return
    }
    
    const dataType = await ipcGetDataType(keys)
    if (!dataType) {
      return
    }

    const currentData = await ipcGetData(dataType, keys)
    if (!currentData) {
      return
    }
    
    updateState({
      currentIndex: tree.node.props.index,
      isAddData: false,
      currentKey: keys[0],
      currentData: currentData,
      currentType: dataType,
    })
  }

  
  render() {
    const currentRedis = this.props.data.currentRedis
    if(!currentRedis) {
      return <div />
    }

    const searchData = this.props.data.searchData
    
    return(
      <div className='redis-key-list'>
        <Tree
          defaultExpandAll
          selectedKeys={[this.props.data.selectedKey]}
          onSelect={(keys, tree) => this.selectNode(keys, tree)} 
        >
          <TreeNode isLeaf={false} title="ROOT">
            {
              searchData.map((v, i) => (
                <TreeNode isLeaf key={v} title={v} index={i} />
              ))
            }
          </TreeNode>
        </Tree>
        <Button
          onClick={() => this.props.data.updateIsAddStatus(true)}
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
