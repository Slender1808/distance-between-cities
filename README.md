# distance-between-cities

#### overpass-turbo

http://overpass-turbo.eu/s/1eUm

```
[out:json];
{{geocodeArea:Rio Grande Sul}}->.a;
// gather results
(
  node[place~"city|town|village|hamlet"](area.a);
);
// print results
out body;
>;
out skel qt;
```

https://wiki.openstreetmap.org/wiki/Overpass_turbo/Extended_Overpass_Turbo_Queries

https://wiki.openstreetmap.org/wiki/Overpass_API

https://github.com/drolbr/Overpass-API