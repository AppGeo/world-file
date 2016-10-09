'use strict';
const D2R = Math.PI / 180;
const A = 6378137.0;
class Coordinate {
  constructor(x, y, convert) {
    if (typeof x === 'number') {
      this.X = x;
    } else if (typeof x === 'string') {
      this.X = parseFloat(x);
    }
    if (typeof y === 'number') {
      this.Y = y;
    } else if (typeof y === 'string') {
      this.Y = parseFloat(y);
    }
    if (convert) {
      this.convert();
    }
  }
  convert() {
    this.X = A * this.X  * D2R;
    this.Y = A * Math.log(Math.tan((Math.PI*0.25) + (0.5 * this.Y  * D2R)));
  }
}



const computeCoefficients = (a, b) => {
  const n = b.length;
  const ipvt = new Array(n);
  ipvt[n - 1] = 1;

  // triangularize

  for (let k = 0; k < n - 1; ++k) {
    // find pivot

    let m = k;

    for (let i = k + 1; i < n; ++i) {
      if (Math.abs(a[i][k]) > Math.abs(a[m][k])) {
        m = i;
      }
    }

    ipvt[k] = m;

    if (m !== k) {
      ipvt[n - 1] = -ipvt[n - 1];
    }

    let temp = a[m][k];
    a[m][k] = a[k][k];
    a[k][k] = temp;

    if (a[k][k] === 0) {
      continue;
    }

    // multipliers

    for (let i = k + 1; i < n; ++i) {
      a[i][k] /= -a[k][k];
    }

    // interchange and eliminate by columns

    for (let j = k + 1; j < n; ++j) {
      temp = a[m][j];
      a[m][j] = a[k][j];
      a[k][j] = temp;

      if (a[k][j] === 0) {
        continue;
      }

      for (let i = k + 1; i < n; ++i) {
        a[i][j] += a[i][k] * a[k][j];
      }
    }
  }

  // forward elimination

  for (let k = 0; k < n - 1; ++k) {
    let m = ipvt[k];
    let temp = b[m];
    b[m] = b[k];
    b[k] = temp;

    for (let i = k + 1; i < n; ++i) {
      b[i] += a[i][k] * b[k];
    }
  }

  // back substitution

  for (let k = n - 1; k > 0; --k) {
    b[k] /= a[k][k];

    for (let i = 0; i < k; ++i) {
      b[i] += -a[i][k] * b[k];
    }
  }

  b[0] /= a[0][0];
  return b;
}
const init = (src, des) => {
  var a = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];
  a[0][0] = src[0].X;
  a[0][1] = src[0].Y;
  a[0][2] = 1;
  a[1][3] = src[0].X;
  a[1][4] = src[0].Y;
  a[1][5] = 1;
  a[2][0] = src[1].X;
  a[2][1] = src[1].Y;
  a[2][2] = 1;
  a[3][3] = src[1].X;
  a[3][4] = src[1].Y;
  a[3][5] = 1;
  a[4][0] = src[2].X;
  a[4][1] = src[2].Y;
  a[4][2] = 1;
  a[5][3] = src[2].X;
  a[5][4] = src[2].Y;
  a[5][5] = 1;
  const b = [
    des[0].X,
    des[0].Y,
    des[1].X,
    des[1].Y,
    des[2].X,
    des[2].Y
  ];
  return [a, b];
}
const affine = (imageWidth, imageHeight, corners) => {
  var src = [
    new Coordinate(imageWidth, imageHeight),
    new Coordinate(0, imageHeight),
    new Coordinate(0, 0)
  ];
  var des = [
    new Coordinate(corners.tl[0], corners.tl[1], true),
    new Coordinate(corners.tr[0], corners.tr[1], true),
    new Coordinate(corners.br[0], corners.br[1], true)
  ];
  const [a, b] = init(src, des);
  return computeCoefficients(a, b);
}
module.exports = affine;
