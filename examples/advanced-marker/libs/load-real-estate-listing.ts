import {RealEstateListing} from '../src/types';

export async function loadRealEstateListing(): Promise<RealEstateListing> {
  const url = new URL('../data/real-estate-listing.json', import.meta.url);

  const listing = (await fetch(url).then(res =>
    res.json()
  )) as RealEstateListing;

  const front = new URL(`../data/images/front.jpg`, import.meta.url).href;
  const bedroom = new URL(`../data/images/bedroom.jpg`, import.meta.url).href;
  const back = new URL(`../data/images/back.jpg`, import.meta.url).href;

  listing.images = [front, bedroom, back];

  return listing;
}
