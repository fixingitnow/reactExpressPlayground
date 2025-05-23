import React from 'react'
import { useParams } from 'react-router-dom'

export default function UserProfile() {
  const { id } = useParams()
  console.log(id)
  return (
    <div>
      <h1>user id: {id}</h1>
    </div>
  )
}
