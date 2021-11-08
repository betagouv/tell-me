import { MutableRefObject, useEffect, useRef } from 'react'

/**
 * Get the previous value of any state
 */
export default function usePrevious<T>(value: T): Common.Nullable<T> {
  const ref = useRef(null) as MutableRefObject<Common.Nullable<T>>

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
