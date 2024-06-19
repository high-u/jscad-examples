const jscad = require('@jscad/modeling');
const { cube, cuboid, cylinder, sphere, cylinderElliptic, roundedCylinder, roundedCuboid, polygon } = jscad.primitives;
const { translate, rotate, scale } = jscad.transforms;
const { subtract, union } = jscad.booleans;
const { colorize, hexToRgb } = jscad.colors;
const { extrudeRotate, extrudeLinear } = jscad.extrusions;

const createWheelHouse = () => {
  const myshape = roundedCylinder({radius: 8, height: 10, center: [0, 0, 0], segments: 12, roundRadius: 3});
  const myshape2 = roundedCylinder({radius: 7, height: 10, center: [0, 0, 0], segments: 12, roundRadius: 2});
  const myshape3 = cylinder({radius: 6, height: 8, center: [0, 0, 1], segments: 12});
  const cube1 = cube({size: 20, center: [0, 10, 0]});
  const cube2 = cube({size: 20, center: [0, 0, -10]});

  const test3 = rotate([0, Math.PI / 180 * -90, 0], cylinder({radius: 4.5, height: 20, center: [0, -5, 0], segments: 12}));
  const test4 = cuboid({size: [20, 10, 10], center: [0, -5, 0]});
  const test5 = subtract(test4, test3);

  return subtract(myshape, myshape2, myshape3, cube1, cube2, test5);

}

const createWheel = () => {
  const wheel = cylinder({radius: 4, height: 7, center: [0, 0, 0], segments: 12});
  const wheel2 = cylinder({radius: 3.8, height: 4, center: [0, 0, 4], segments: 12});
  const wheel22 = cylinder({radius: 3.8, height: 6, center: [0, 0, -1.2], segments: 12});
  const wheelCenter = cylinder({radius: 1, height: 4, center: [0, 0, 0.4], segments: 12});
  const sporkCircle = [...Array(6)].map((e, i) => {
    return rotate([0, 0, Math.PI / 180 * (i * 60)], cylinder({radius: 0.8, height: 4, center: [0, 2.4, 1], segments: 12}));
  });

  return union(wheelCenter, subtract(wheel, wheel2, wheel22, sporkCircle));
}

const createBumper2 = () => {
  return roundedCylinder({radius: 7, height: 10, center: [0, 0, 0], segments: 12, roundRadius: 2});
}
const createTire = () => {
  const tire = roundedCylinder({radius: 6, height: 8, center: [0, 0, 0], segments: 12, roundRadius: 2});
  const tire2 = cylinder({radius: 4, height: 10, center: [0, 0, 0.1], segments: 12});
  return subtract(tire, tire2);
}

const main = () => {
  const wheelHouse = [[20, -12, 180], [20, 12, 0], [-20, -12, 180], [-20, 12, 0]].map((e) => {
    return translate([e[0], e[1], 6], rotate([Math.PI / 180 * -90, 0, Math.PI / 180 * e[2]], createWheelHouse()));
  });

  const tire3 = [[20, -12], [20, 12], [-20, -12], [-20, 12]].map((e) => {
    return translate([e[0], e[1], 6], rotate([Math.PI / 180 * -90, 0, 0], createTire()));
  });

  const wheel3 = [[20, -12, 180], [20, 12, 0], [-20, -12, 180], [-20, 12, 0]].map((e) => {
    return translate([e[0], e[1], 6], rotate([Math.PI / 180 * -90, 0, Math.PI / 180 * e[2]], createWheel()));
  });

  const bumperExclusion = [[20, -12, 180], [20, 12, 0], [-20, -12, 180], [-20, 12, 0]].map((e) => {
    return translate([e[0], e[1], 6], rotate([Math.PI / 180 * -90, 0, Math.PI / 180 * e[2]], createBumper2()));
  });

  const t1 = roundedCuboid({size: [60, 22, 8], roundRadius: 1, center: [0, 0, 22], segments: 12});

  const body1 = roundedCuboid({size: [56, 26, 12], roundRadius: 1, center: [0, 0, 12], segments: 12});
  const body3 = cube({size: 30, center: [40, 0, 5]});
  const body6 = rotate([0, Math.PI / 180 * 45, 0], cube({size: 30, center: [26, 0, 20]}));
  const body7 = rotate([0, Math.PI / 180 * -45, 0], cube({size: 30, center: [-28, 0, 28]}));
  const body = subtract(body1, bumperExclusion);

  const body5 = roundedCuboid({size: [44, 24, 12], roundRadius: 1, center: [-5, 0, 21], segments: 12});
  const body4 = rotate([0, Math.PI / 180 * -30, 0], cube({size: 30, center: [34, 0, 10]}));
  
  const body2 = subtract(body5, body4, t1);

  

  const b1 = roundedCuboid({size: [10, 31, 8], roundRadius: 3, center: [0, 0, 0], segments: 12});
  const b2 = cube({size: 40, center: [0, 0, -21]});
  const b3 = cube({size: 40, center: [0, 0, 21]});
  // const b4 = 
  const bumper = subtract(translate([25, 0, 9.9], subtract(b1, b3)), bumperExclusion);
  const bumper2 = subtract(translate([-25, 0, 9.9], subtract(b1, b3)), bumperExclusion);

  const step1 = cuboid({size: [30, 31, 0.5], center: [0, 0, 6]});
  const step2 = subtract(step1, bumperExclusion)

  const test = extrudeLinear({height: 2}, polygon({ points: [ [0, 0],[30, 0],[30, 30] ] }));

  

  return [
    colorize(hexToRgb("#333333ff"), wheelHouse),
    colorize(hexToRgb("#333333ff"), tire3),
    colorize(hexToRgb("#ccccccff"), wheel3),
    colorize(hexToRgb("#99aa99ff"), body),
    
    colorize(hexToRgb("#333333ff"), body2),
    colorize(hexToRgb("#333333ff"), bumper),
    colorize(hexToRgb("#333333ff"), bumper2),
    
    // t1,
    // test2,
    // test5
  ];
}

module.exports = { main }
