import { useCallback, useEffect, useRef } from 'react'

export default function useIsMounted() {
  const isMountedRef = useRef(true)

  useEffect(() => {
    const unmount = () => {
      isMountedRef.current = false
    }

    return unmount
  }, [])

  const getIsMounted = () => isMountedRef.current
  const isMounted = useCallback(getIsMounted, [])

  return isMounted
}
