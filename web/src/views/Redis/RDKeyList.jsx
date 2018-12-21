import React from 'react'
import { Tree, Input, Icon } from 'antd';
import { withRedis } from './context'

const { TreeNode } = Tree;
const Search = Input.Search;

class RDKeyList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }
  
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  generateTreeData() {
    const connectMap = this.props.data.config.connect
    if (!connectMap) {
      return []
    }
    const redisData = this.props.data.redisData
    const connectMapKeys = Object.keys(connectMap)

    return connectMapKeys.map((key) => {
      const obj = connectMap[key]
      const data = redisData[key]

      obj.key = key

      if (data) {
        obj.data = data
      } else {
        obj.data = []
      }

      obj.selectedKey = ''
      obj.selectedValue = ''
      
      return obj
    })
  }
  
  generateTreeNode(data, isParent) {
    console.log(data, isParent)
    if (isParent) {
      return data.map(v => {
        const title = v.key
        const key = v.key
        return (
          <TreeNode key={key} title={title}>
            {this.generateTreeNode(v.data, false)}
          </TreeNode>
        )
      })
    } else {
      return data.map(v => (
        <TreeNode key={v} title={v} />
      ))
    }
  }

  renderTree() {
    const data = this.generateTreeData()

    if (!data.length) {
      return <div></div>
    }
    return (
      <Tree
        expandedKeys={this.state.expandedKeys}
        onExpand={(expandedKeys) => this.onExpand(expandedKeys)}
        loadData={this.props.data.SearchRedis.bind(this)}
      >
        {this.generateTreeNode(data, true)}
      </Tree>
    )
  }
  
  render() {
    return(
      <div className="redis-key-list">
        {this.renderTree()}
      </div>
    )
  }
}

export default withRedis(RDKeyList)
