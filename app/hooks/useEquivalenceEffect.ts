import * as R from 'ramda'
import { EffectCallback, useEffect } from 'react'

import * as usePrevious from './usePrevious'

/**
 * Run an effect observing object-dependencies equivalence (instead of equality) updates.
 *
 * @description
 * Enhanced version of `React.useEffect()` hook taking a pure object as dependency
 * and only running the associated effect if the properties and/or values of the objet have "really" changed.
 *
 * Can handle deeply nested objects and arrays.
 *
 * **⚠️ Support only POJO-like arrays and objects!**
 */
export default function useEquivalenceEffect(effect: EffectCallback, depedencies: any[]): void {
  const prevDependencies = usePrevious.default(depedencies)

  useEffect(() => {
    // Deep-equivalence check
    if (R.equals(depedencies, prevDependencies)) {
      return () => undefined
    }

    return effect()
  })
}
