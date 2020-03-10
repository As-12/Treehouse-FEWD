const one = 1;

function toomanyParms(a, b, c, d, e) {
  return a + b + c + d + e;
}

toomanyParms(1, 2, 3, 4, one + 5);

function badStyle(a, b, c, d, e) {
  return 1;
}
