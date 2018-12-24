import React from 'react'
import { Tree } from 'antd';
import { WithRedis } from './context'

const { TreeNode } = Tree;

export default WithRedis(class RedisKey extends React.Component {
  render() {
    const selectedRedisName = this.props.data.selectedRedis
    if(!selectedRedisName) {
      return <div />
    }
    const searchData = this.props.data.searchData
    
    const treeNodeList = searchData.map(v => (
      <TreeNode key={v} title={v} />
    ))

    return(
      <div className='redis-key-list'>
        <Tree
          defaultExpandParent={true}
          defaultExpandedKeys={['-']}
          onSelect={this.props.data.SelectNode.bind(this)}
        >
          <TreeNode title={`root-${selectedRedisName}`} key='-'>
            {treeNodeList}
          </TreeNode>
        </Tree>
      </div>
    )
  }
})
