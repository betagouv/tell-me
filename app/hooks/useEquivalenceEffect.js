import * as R from 'ramda'
import { useEffect } from 'react'

import usePrevious from './usePrevious'

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
 *
 * @param {import("react").EffectCallback}  effect
 * @param {Object[]}                        objectDepedency
 */
export default function useEquivalenceEffect(effect, objectDepedencies) {
  const prevObjectDependencies = usePrevious(objectDepedencies)

  useEffect(() => {
    // Deep-equivalence check
    if (R.equals(objectDepedencies, prevObjectDependencies)) {
      return () => undefined
    }

    return effect()
  })
}
