import React from 'react'

export default function ImageSlider() {
  return (
    <div className="image-slider grid grid-cols-3 justify-center items-center h-screen">
      <button>prev</button>
      <img src="https://picsum.photos/200/300"></img>
      <button>next</button>
    </div>
  )
}
