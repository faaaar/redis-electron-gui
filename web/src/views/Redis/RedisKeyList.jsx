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

    return(
      <div className='redis-key-list'>
        <Tree
          selectedKeys={[this.props.data.selectedKey]}
          onSelect={this.props.data.SelectNode.bind(this)}
        >
          {
            searchData.map(v => (
              <TreeNode isLeaf key={v} title={v} />
            ))
          }
        </Tree>
      </div>
    )
  }
})
