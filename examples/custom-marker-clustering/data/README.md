# `castles.json` Data Source

(tools: `wget`, [`jq`](https://jqlang.github.io/jq/))

## 1. fetch data from overpass-api.de

```shell
query="[out:json];nwr[historic=castle][tourism=attraction][name][wikidata];convert item ::=::,::geom=geom(),_osm_type=type(); out center;"
wget -O castles-osm.json "http://overpass-api.de/api/interpreter?data=${query}"
```

## 2. transform to proper geojson, ditching most tags

```shell
jq '{
  type: "FeatureCollection",
  features: .elements | map({
    type:"Feature",
    id: .tags.wikidata,
    geometry: .geometry,
    properties: {
      name: (.tags["name:en"] // .tags.name),
      wikipedia:.tags.wikipedia,
      wikidata:.tags.wikidata
    }
  })
}' \
  < castles-osm.json \
  > castles.json
```

## 3. some manual adjustments

- a couple of duplicate ids removed or changed
- one instance where the wikipedia-tag was broken and didn't contain the
  language part
