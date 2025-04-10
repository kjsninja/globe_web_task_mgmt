import { useState } from "react"

interface LoaderProps {
  loading: boolean
}

export default function FullPageLoader(props: LoaderProps) {
  return (
    <div>
      {props.loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/80 dark:bg-black/80">
          <div className="flex flex-col items-center gap-4">
            <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}
