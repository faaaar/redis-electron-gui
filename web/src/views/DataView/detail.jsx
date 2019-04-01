import React from 'react'
import {connect} from 'react-redux'

class  Detail extends React.Component {
  render() {
    return(
      <div className="detail-view"></div>
    )
  }
}

export default connect(state =>  {
  global: state.global,
  redis: state.redis,
})(Detail)
