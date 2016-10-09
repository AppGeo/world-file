# world-file

generate a [world file](https://en.wikipedia.org/wiki/World_file) for data if you give it the dimensions and the corner points.  Based off code by [Peter Girard](https://github.com/pgirard) translated from C#.

# API

```js
worldfile(width, height, corners);
```

where corners is an object with cooridnates for the corners of the image, in the form

```js
{
  tr: [1, 1],
  tl: [0, 1],
  br: [1, 0]
}
```
coordinates are geojson style so x,y lon,lat, tr is top right, tl is top left, br is bottom right, input is in lat lon wgs84, output is in web mercator.
