const jscad = require('@jscad/modeling');
const { polyhedron, rectangle, ellipse, cube, cylinder, sphere, cylinderElliptic } = jscad.primitives;
const { translate, rotate, scale } = jscad.transforms;
const { subtract, union } = jscad.booleans;
const { colorize, hexToRgb } = jscad.colors;
const { hull, hullChain } = jscad.hulls;
const { extrudeLinear } = jscad.extrusions

const createSphere = () => {
  const mySphere = sphere({radius: 10, center: [0, 0, 0], segments: 32});
  return mySphere;
}

const createCubes = () => {
  const myCube = cube({size: 10});
  return [...Array(6)].map((e, i) => {
    return rotate(
      [0, 0, Math.PI / 180 * (i * 60 + 30)],
      translate (
        [ 20,  0,  0],
        myCube,
      ),
    );
  });
}

const createFuga = () => {
  const shape1 = translate([0, 0, 0], sphere({radius: 2, center: [0, 0, 0], segments: 12}));
  const shape2 = translate([0, 30, 30], sphere({radius: 2, center: [0, 0, 0], segments: 12}));
  const shape3 = translate([15, 30, 30], sphere({radius: 2, center: [0, 0, 0], segments: 12}));
  return hullChain( shape1, shape2, shape3 );

}

const createPolyhedron = () => {
  const points = [ 
    [10, 10, 0], 
    [10, -10, 0], 
    [-10, -10, 0], 
    [-10, 10, 0], 
    [0, 0, 20], // 四角錐の上部先端
  ]

  // 上記で定義した『点』でどの点とどの点をつないで面にするかを定義する
  // 配列無いの値は、上記点のリストのインデックス（おそらく）
  //
  // 四角錐の上部頂点からは、面が 4 つあるので、下記リストに、『4』（points の index 4）が 4 つある。
  // 面は三角形でしか定義できないかも？
  const faces = [ 
    [0, 1, 4], // 四角錐の上部頂点を含む三角形（1）
    [1, 2, 4], // 四角錐の上部頂点を含む三角形（2）
    [2, 3, 4], // 四角錐の上部頂点を含む三角形（3）
    [3, 0, 4], // 四角錐の上部頂点を含む三角形（4）
    [1, 0, 3], // 底面の三角形の面（片側）
    [2, 1, 3], // 底面の三角形の面（片側）
    
  ]
  const myshape = polyhedron({  points: points, faces: faces, orientation: 'inward'})
  
  return myshape;
}

const main = () => {
  const myCubes = createCubes();
  const mySphere = createSphere();
  const b = createFuga();
  const c = createPolyhedron();
  return [
    colorize(hexToRgb('#ff8800'), translate([0, 0, 20], mySphere)),
    colorize(hexToRgb('#0088ff'), translate([0, 0, 5], union(myCubes))),
    colorize(hexToRgb('#ff88ff'), translate([0, 0, 2], b)),
    colorize(hexToRgb('#008888'), translate([0, 0, 30], c)),
  ];
}

module.exports = { main }
