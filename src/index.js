const jscad = require('@jscad/modeling');
const { bezier } = jscad.curves;
const { colorize } = jscad.colors
const { extrudeRotate } = jscad.extrusions;
const { subtract, intersect, union } = jscad.booleans
const { translate, scale, rotate } = jscad.transforms;
const { polygon, roundedCuboid, cube, cylinder } = jscad.primitives;

const createBody = () => {
  const count = 32;
  const curveX = bezier.create([0, 4, 15, 8, 15, 0, 1.2, 1.2, 0])
  const curveY = bezier.create([0, 0, -2, 8, 9, 11, 9, 16, 16])
  const points = [...Array(count)].map((e, i) => {
    return [
      bezier.valueAt(i / (count - 1), curveX),
      bezier.valueAt(i / (count - 1), curveY),
    ];
  });
  console.log({points});
  const shapes = translate([0, 0, 0], polygon({points}));
  return extrudeRotate(
    {segments: 32, startAngle: 0, angle: (Math.PI * 2), overflow: 'cap'},
    shapes
  );
};

const createEyes = () => {
  const eye = rotate(
    [0, Math.PI / 180 * 42, 0],
    cylinder({height: 2, radius: 1.5})
  );
  return union(
    translate([7.4, -2.2, 7.8], eye),
    translate([7.4, 2.2, 7.8], eye)
  );
};

const createIrises = () => {
  const iris = rotate(
    [0, Math.PI / 180 * 42, 0],
    cylinder({height: 2, radius: 0.65})
  );
  return union(
    translate([7.4, -2.2, 7.8], iris),
    translate([7.4, 2.2, 7.8], iris)
  );
};

const main = () => {
  const baseBody = createBody();
  const followoutBody = translate(
    [0, 0, 0.1],
    scale([0.98, 0.98, 0.98], baseBody)
  );
  const body = subtract(baseBody, followoutBody);
  const followoutInternalBody = translate(
    [0, 0, 0.2],
    scale([0.96, 0.96, 0.96], baseBody)
  );
  const internalBody = subtract(followoutBody, followoutInternalBody);
  const mouth = translate(
    [8, 0, 5.5],
    roundedCuboid({size: [10, 8, 1], roundRadius: 0.49})
  );
  const eyes = createEyes();
  const blackEyes = createIrises();
  return [
    colorize([0.3, 0.65, 1], subtract(body, mouth, eyes)),
    colorize([1, 0, 0], subtract(internalBody, mouth, eyes)),
    colorize([1, 1, 1], intersect(eyes, internalBody)),
    colorize([0.1, 0.1, 0.1], intersect(body, blackEyes)),
  ];
}

module.exports = { main }
