import React from 'react'

class DataView extends React.Component {
  render() {
    return (
      <div className="data-view">
        <h1>Hi</h1>
      </div>
    )
  }
}

export connect(state => ({
  global: state.global,
  redis: state.redis,
}))
