'use strict';
const affine = require('./affine');
const makeWorld = transform => {
  const [A,B,C,D,E,F] = transform;
  const out = [A, D, B, E, C, F];
  return out.join('\n');
}
module.exports = (width, height, corners) => makeWorld(affine(width, height, corners));
