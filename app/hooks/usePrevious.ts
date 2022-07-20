import { MutableRefObject, useEffect, useRef } from 'react'

/**
 * Get the previous value of any state
 */
export function usePrevious<T>(value: T): T | null {
  const ref = useRef(null) as MutableRefObject<T | null>

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
