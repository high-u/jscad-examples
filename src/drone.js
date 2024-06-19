const jscad = require('@jscad/modeling');
const { cube, cylinder, sphere, cylinderElliptic } = jscad.primitives;
const { translate, rotate, scale } = jscad.transforms;
const { subtract, union } = jscad.booleans;
const { colorize, hexToRgb } = jscad.colors;

const createArms = () => {
  const arm = translate([0, 20, 0], rotate(
    [Math.PI / 180 * 90, 0, 0],
    cylinder({height: 28, radius: 1.5, segments: 12})
  ));
  return [...Array(6)].map((e, i) => {
    return rotate([0, 0, Math.PI / 180 * (i * 60 + 30)], arm);
  });
}

const createFeet = () => {
  return [
    translate([26, 0, 0], rotate(
      [Math.PI / 180 * 90, 0, 0],
      cylinder({height: 44, radius: 1.5, segments: 12})
    )),
    translate([-26, 0, 0], rotate(
      [Math.PI / 180 * 90, 0, 0],
      cylinder({height: 44, radius: 1.5, segments: 12})
    )),
  ];
}

const createLegs = () => {
  return [
    translate([-17, 0, 19], rotate(
      [0, Math.PI / 180 * 25, 0],
      cylinder({height: 40, radius: 1.5, segments: 12})
    )),
    translate([17, 0, 19], rotate(
      [0, Math.PI / 180 * -25, 0],
      cylinder({height: 40, radius: 1.5, segments: 12})
    )),
  ];
}

const createMotors = () => {
  return [...Array(6)].map((e, i) => {
    return rotate([0, 0, Math.PI / 180 * (i * 60 + 30)], translate(
      [0, 34, 0], cylinder({height: 5, radius: 2.3, segments: 12})
    ));
  });
}

const createBody = () => {
  return subtract(
    scale([0.7, 1.0, 0.6],
      rotate(
        [Math.PI / 180 * 90, 0, Math.PI / 180 * 90],
        sphere({radius: 20, segments: 28})
      )
    ),
    translate([0, 0, -32], cube({size: 60})),
    translate([41, 0, 32], cube({size: 60})),
    translate([-41, 0, 32], cube({size: 60})),
  );
}

const createRotors = () => {
  const wing = translate(
    [7, 0, 0],
    rotate([Math.PI / 180 * 30, 0, 0], rotate(
      [0, Math.PI / 180 * 90, 0],
      cylinderElliptic({
        height: 14,
        startRadius: [0.1, 0.5],
        endRadius: [0.2, 2],
        segments: 4
      }))
    ));
  const rotor = [...Array(18)].map((e, i) => {
    return translate([0, 34, 0], rotate(
      [0, 0, Math.PI / 180 * (i * 20)],
      wing
    ));
  });
  return [...Array(6)].map((e, i) => {
    return rotate(
      [0, 0, Math.PI / 180 * (i * 60 + 30)],
      rotor
    );
  });
}

const createAntenna = () => {
  return cylinder({height: 16, radius: 0.5, segments: 12});
}

const main = () => {
  const arms = createArms();
  const feet = createFeet();
  const legs = createLegs();
  const motors = createMotors();
  const body = createBody();
  const rotors = createRotors();
  const antenna = createAntenna();
  return [
    colorize(hexToRgb('#00ccccff'), translate([0, 0, 34], union(arms))),
    colorize(hexToRgb('#cccc00ff'), feet),
    colorize(hexToRgb('#00cc00ff'), legs),
    colorize(hexToRgb('#cc00ccff'), translate([0, 0, 34], motors)),
    colorize(hexToRgb('#aaaaaaff'), translate([0, 0, 34], body)),
    colorize(hexToRgb('#cccccccc'), translate([0, 0, 37], union(rotors))),
    colorize(hexToRgb('#000000ff'), translate([8, 11, 48], antenna)),
  ];
}

module.exports = { main }
