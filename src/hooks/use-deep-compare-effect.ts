import {DependencyList, EffectCallback} from 'react';
import {useCustomCompareEffect} from './use-custom-compare-efffect';
import isDeepEqual from 'fast-deep-equal';

export function useDeepCompareEffect(
  effect: EffectCallback,
  dependencies: DependencyList
) {
  useCustomCompareEffect(effect, dependencies, isDeepEqual);
}
