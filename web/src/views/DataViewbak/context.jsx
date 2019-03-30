import React from 'react'

const ctx = React.createContext()

export const {Provider, Consumer} = ctx

export const WithRedis = Component => props => (
  <Consumer>{data => <Component {...props} data={data} />}</Consumer>
)
  
