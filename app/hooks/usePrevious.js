import { useEffect, useRef } from 'react'

/**
 * Get the previous value of any state
 */
export default function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
