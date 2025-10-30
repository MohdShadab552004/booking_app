import React from 'react'

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-70 h-80 bg-gray-200 animate-pulse rounded-xl"></div>
        ))}
    </div>
  )
}

export default Loading