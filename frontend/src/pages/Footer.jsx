// import React from 'react'
import { FaCopyright } from "react-icons/fa";

export default function  Footer() {
  return (
    <div className="relative bottom-0 w-full mt-auto">
      <div className='mt-12 bottom-0 w-full bg-black h-20 flex bg-fixed items-center text-white gap-3'>

        <FaCopyright className=" text-3xl ml-24"/>
          <h2 className="text-xl">Eventify</h2>
      </div>
    </div>
  )
}
