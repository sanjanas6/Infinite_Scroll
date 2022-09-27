import React from 'react'
import { useLocation } from 'react-router-dom'


function Post() {
    const {state} = useLocation()
    if(state === null){
      return <h1>Post not exists</h1>
    }
    const obj = JSON.stringify(state.post)
  return (
    <div>{obj}</div>
  )
}

export default Post