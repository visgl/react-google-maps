import {DependencyList, EffectCallback} from 'react';
import {useCustomCompareEffect} from './use-custom-compare-efffect';
import {deepEqual as isDeepEqual} from 'fast-equals';

export function useDeepCompareEffect(
  effect: EffectCallback,
  dependencies: DependencyList
) {
  useCustomCompareEffect(effect, dependencies, isDeepEqual);
}
