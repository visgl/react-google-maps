import type {MetaFunction} from '@remix-run/node';
import MyMap from '../components/map/map.client';
import {ClientOnly} from 'remix-utils/client-only';

export const meta: MetaFunction = () => {
  return [{title: 'Remix Example'}];
};

export default function Index() {
  return <ClientOnly>{() => <MyMap />}</ClientOnly>;
}
