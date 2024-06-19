const jscad = require('@jscad/modeling');
const { circle, cuboid, torus, roundedCuboid, roundedCylinder, ellipsoid, 
  rectangle, ellipse, cube, cylinder, sphere, cylinderElliptic } = jscad.primitives;
const { translate, rotate, scale } = jscad.transforms;
const { subtract, union } = jscad.booleans;
const { colorize, hexToRgb } = jscad.colors;
const { hull, hullChain } = jscad.hulls;
const { extrudeLinear } = jscad.extrusions

const createBody = () => {
  const bodyWidth = 10;
  const nose = subtract(
    ellipsoid({
      radius: [bodyWidth, 24, 5], 
      center: [0, 1, 0], 
      segments: 64
    }), 
    cuboid({
      size: [30, 30, 20], 
      center: [0, 25, 0]
    })
  );
  const cockpit = cylinderElliptic({
    height: 10, 
    center : [0, 0, 5], 
    startRadius: [bodyWidth, 20], 
    endRadius: [bodyWidth - 2, 8],  
    segments: 64
  });
  const bodyLength = 22;
  const luggageBaseCornerCircle = sphere({radius: 1.0, center: [0, 0, 0], segments: 32});
  const luggageBase = hull(
    translate([7 , 22, 9.5], rotate([Math.PI / 180 * 90, 0, 0],  luggageBaseCornerCircle)),
    translate([-7, 22, 9.5], rotate([Math.PI / 180 * 90, 0, 0],  luggageBaseCornerCircle)),
    translate([-9, 22, 0.0], rotate([Math.PI / 180 * 90, 0, 0],  luggageBaseCornerCircle)),
    translate([9 , 22, 0.0], rotate([Math.PI / 180 * 90, 0, 0],  luggageBaseCornerCircle)),
  );
  const luggageBottom = hull(
    translate([8 , 22, 4.5], rotate([Math.PI / 180 * 90, 0, 0],  luggageBaseCornerCircle)),
    translate([-8, 22, 4.5], rotate([Math.PI / 180 * 90, 0, 0],  luggageBaseCornerCircle)),
    translate([-9, 22, 0.0], rotate([Math.PI / 180 * 90, 0, 0],  luggageBaseCornerCircle)),
    translate([9 , 22, 0.0], rotate([Math.PI / 180 * 90, 0, 0],  luggageBaseCornerCircle)),
  );

  const tailBaseCornerCircle = sphere({radius: 1.0, center: [0, 0, 0], segments: 16});
  const tailBase = hull(
    translate([3, 32, 9], rotate([Math.PI / 180 * 90, 0, 0],  tailBaseCornerCircle)),
    translate([-3, 32, 9], rotate([Math.PI / 180 * 90, 0, 0],  tailBaseCornerCircle)),
    translate([-4, 32, 3], rotate([Math.PI / 180 * 90, 0, 0],  tailBaseCornerCircle)),
    translate([4, 32, 3], rotate([Math.PI / 180 * 90, 0, 0],  tailBaseCornerCircle)),
  );
  const tailPoint = sphere({
    radius: 0.8, 
    center: [0, 61, 8], 
    segments: 64
  });
  const z1 = 12;
  const ceiling1 = cylinderElliptic({
    startRadius: [bodyWidth - 4, 10], 
    endRadius: [bodyWidth - 4, 10], 
    height: 2, 
    center: [0, 10, z1], 
    segments: 64
  });
  const ceiling2 = cylinderElliptic({
    startRadius: [bodyWidth - 4, 10], 
    endRadius: [bodyWidth - 4, 10], 
    height: 2, 
    center: [0, 10, z1], 
    segments: 64
  });
  const rotorBase = cylinderElliptic({
    startRadius: [2, 2], 
    endRadius: [2, 2], 
    height: 2, 
    center: [0, 4, z1 + 2], 
    segments: 64
  });
  const tireCover = roundedCuboid({
    size: [26, 7, 1.5], 
    roundRadius: 0.7, 
    center: [0, 0, 0], 
    segments: 64
  });
  const tireCoverRear = translate([0, 6, 0.5],
    rotate([0, Math.PI / 180 * 90, 0], 
      roundedCylinder({
        radius: 0.2, 
        height: 26, 
        roundRadius: 0.1, 
        center: [0, 0, 0], 
        segments: 64
      })
    )
  );
  const tireSpace = cuboid({
    size: [30, 5, 1], 
    center: [0, 0, -0.5]
  });
  const tireHouse = translate([0, 16, -0.9],
    subtract(
      hullChain(
        tireCover, 
        tireCoverRear
      ), 
      tireSpace
    )
  );
  const sole = translate([0, 0, -12],
    rotate([Math.PI / 180 * 0, 0, 0], 
    cuboid({
      size: [30, 60, 20], 
      center: [0, 0, 0]
    })
  ));
  
  const body = union(
    subtract(
      hullChain(
        nose, 
        luggageBottom, 
        luggageBase, 
        cockpit 
      ), 
      sole
    ), 
    hullChain(
      luggageBase, 
      tailBase, 
      tailPoint
    ), 
    hull( 
      tailBase,
      luggageBase, 
      cockpit, 
      ceiling1 
    ), 
    hullChain(
      ceiling2, 
      rotorBase
    ), 
    tireHouse,
  );

  return body;

  // 確認用
  return [
    nose,
    cockpit,
    luggageBase,
    luggageBottom,
    tailBase,
    tailPoint,
    ceiling1,
    ceiling2,
    rotorBase,
    tireHouse,
    // luggageBottom2,
  ];
}

// 水平尾翼
const createHorizontalTailplane = () => {
  const centerHeight = 0.4;
  const centerWidth = 2;
  const sideHeight = 0.2;
  const sideWidth = 1;
  const centerHalfLength = 9;
  const sidePosition = 12;
  const myshape1 = translate([-centerHalfLength, 0, 0],
    rotate([0, Math.PI / 180 * 90, 0],
      cylinderElliptic({
        startRadius: [centerHeight, centerWidth], 
        endRadius: [centerHeight, centerWidth], 
        height: 0.1, 
        center: [0, 0, 0], 
        segments: 32
      })
    )
  );
  const myshape2 = translate([centerHalfLength, 0, 0],
    rotate([0, Math.PI / 180 * 90, 0],
      cylinderElliptic({
        startRadius: [centerHeight, centerWidth], 
        endRadius: [centerHeight, centerWidth], 
        height: 0.1, 
        center: [0, 0, 0], 
        segments: 32
      })
    )
  );
  const myshape3 = translate([sidePosition, 0, 2],
    rotate([0, Math.PI / 180 * 60, 0],
      cylinderElliptic({
        startRadius: [sideHeight, sideWidth], 
        endRadius: [sideHeight, sideWidth], 
        height: 0.1, 
        center: [0, 0, 0], 
        segments: 32
      })
    )
  );
  const myshape4 = translate([-sidePosition, 0, 2],
    rotate([0, Math.PI / 180 * -60, 0],
      cylinderElliptic({
        startRadius: [sideHeight, sideWidth], 
        endRadius: [sideHeight, sideWidth], 
        height: 0.1, 
        center: [0, 0, 0], 
        segments: 32
      })
    )
  );
  const myshape5 = translate([0, -1, 0],
    rotate([0, Math.PI / 180 * 90, 0],
      cylinderElliptic({
        startRadius: [centerHeight, centerWidth + 1], 
        endRadius: [centerHeight, centerWidth + 1], 
        height: 0.1, 
        center: [0, 0, 0], 
        segments: 32
      })
    )
  );
  return hullChain(
      myshape4, 
      myshape1, 
      myshape5, 
      myshape2, 
      myshape3, 
    );

  return [
    myshape1,
    myshape2,
    myshape3,
    myshape4, 
    myshape5, 
  ]
}

const createVerticalTailplane = () => {
  const topWidth = 2;
  const topHeight = 0.4;
  const bottomWidth = 4;
  const bottomHeight = 0.4;
  const myshape1 = translate([0, 8, 10],
    rotate([0, 0, Math.PI / 180 * 90],
      cylinderElliptic({
        startRadius: [topWidth, topHeight], 
        endRadius: [topWidth, topHeight], 
        height: 0.1, 
        center: [0, 0, 0], 
        segments: 32
      })
    )
  );
  const myshape2 = translate([0, 0, 0],
    rotate([0, 0, Math.PI / 180 * 90],
      cylinderElliptic({
        startRadius: [bottomWidth, bottomHeight], 
        endRadius: [bottomWidth, bottomHeight], 
        height: 0.1, 
        center: [0, 0, 0], 
        segments: 32
      })
    )
  );
  return hullChain(
    myshape1, 
    myshape2
  );
}

// メインローター
const createMainRotor = () => {
  const size = 23;
  const wing = translate([size, 0, 0],
    rotate([Math.PI / 180 * 15, 0, 0], 
      rotate([0, Math.PI / 180 * 90, 0],
        cylinderElliptic({
          height: size * 2,
          startRadius: [0.1, 0.5],
          endRadius: [0.2, 2],
          segments: 8
        })
      ),
    ),
  );
  const rotors = [...Array(12)].map((e, i) => {
    return rotate([0, 0, Math.PI / 180 * (i * 30)],
      wing
    )
  });
  return union(...rotors);
}

// メインローターヘッド
const createMainRotorHead = () => {
  const a = cuboid({
    size: [10, 10, 10], 
    center: [0, 0, -4.5]
  });
  return subtract(
    ellipsoid({
      radius: [2.5, 2.5, 0.8], 
      height: 0.5, 
      center: [0, 0, 0.75], 
      segments: 32
    }), 
    a
  );
}

// メインローターシャフト
const createMainRotorShaft = () => {
  const controlShaft = translate([1.5, 0, -1],
    rotate([0, 0, 0], 
      rotate([0, 0, 0],
        cylinder({
          height: 2,
          radius: 0.2,
          segments: 8
        })
      )
    )
  );
  const controlShafts = [...Array(6)].map((e, i) => {
    return rotate([0, 0, Math.PI / 180 * (i * 60)],
      controlShaft,
    )
  });
  const driveShaft = cylinder({
    radius: 1,
    height: 2,
    center: [0, 0, -0.5],
    segments: 16
  });
  return union(driveShaft, ...controlShafts);
}

// テールローター
const createTailRotor = () => {
  const size = 3;
  const wing = translate([ 0, 0, size + 0.5],
    rotate([0, 0, Math.PI / 180 * 15], 
      rotate([0, 0, 0],
        cylinderElliptic({
          height: size * 2,
          startRadius: [0.1, 0.2],
          endRadius: [0.1, 0.6],
          segments: 8
        })
      )
    )
  );
  const rotors = [...Array(12)].map((e, i) => {
    return rotate([Math.PI / 180 * (i * 30),0,0],
      wing
    )
  });
  const rotorShaft = translate([0.2, 0, 0],
    rotate([0, Math.PI / 180 * 90, 0],
      cylinder({
        radius: 0.8, 
        height: 1, 
        center: [0, 0, 0], 
        segments: 16
      })
    )
  );
  return union(...rotors, rotorShaft);
}

// 前輪
const createFrontLeg = () => {
  const shaft = translate([0, 0, 0],
    rotate([0, Math.PI / 180 * 90, 0],
      cylinder({
        radius: 0.3, 
        height: 2, 
        center: [0, 0, 0], 
        segments: 16
      })
    )
  );
  const leg = translate([0, 0, 2],
    rotate([0, 0, 0],
      cylinder({
        radius: 0.3, 
        height: 4, 
        center: [0, 0, 0], 
        segments: 16
      })
    )
  );
  return union(shaft, leg);
}

// 後輪
const createRearLeg = () => {
  const shaft = translate([0, 0, 0],
    rotate([0, Math.PI / 180 * 90, 0],
      cylinder({
        radius: 0.4, 
        height: 2, 
        center: [0, 0, 0], 
        segments: 16
      })
    )
  );
  const leg = translate([0, 0, 2],
    rotate([0, 0, 0],
      cylinder({
        radius: 0.4, 
        height: 5, 
        center: [0, 0, 0], 
        segments: 16
      })
    )
  );
  const width = 8;
  return union(
    translate([0, 0, 0], shaft), 
    translate([0, 0, 0], leg), 
  );
}

// リアホイール
const createRearWheel = () => {
  return rotate([0,Math.PI / 180 * 90,0], 
    cylinder({
      radius: 0.7,
      height: 1.0,
      center: [0, 0, 0],
      segments: 16
    })
  );
}

// フロントホイール
const createFrontWheel = () => {
  return rotate([0,Math.PI / 180 * 90,0], 
    cylinder({
      radius: 0.4,
      height: 0.5,
      center: [0, 0, 0],
      segments: 16
    })
  );
}

// リアタイヤ
const createRearTire = () => {
  return rotate(
    [0,Math.PI / 180 * 90,0],
    torus({
      innerRadius: 0.5, 
      outerRadius: 0.8
    })
  );
}

// フロントタイヤ
const createFrontTire = () => {
  return rotate(
    [0,Math.PI / 180 * 90,0],
    torus({
      innerRadius: 0.3, 
      outerRadius: 0.6
    })
  );
}

const main = () => {
  const body = createBody();
  const horizontalTailplane = createHorizontalTailplane();
  const verticalTailplane = createVerticalTailplane();
  const frontLeg = createFrontLeg();
  const rearLeg = createRearLeg();
  const mainRotor = createMainRotor();
  const tailRotor = createTailRotor();
  const tailplaneHeight = 11.5;
  const frontWheel = createFrontWheel();
  const rearWheel = createRearWheel();
  const mainRotorHead = createMainRotorHead();
  const mainRotorShaft = createMainRotorShaft();
  const rearTire = createRearTire();
  const frontTire = createFrontTire();
  const rearTirePosition = [17, 1.3];
  const frontTirePosition = [0.9, 0.8, -12];
  return [
    // ボディ
    colorize(hexToRgb('#cccccc'), translate([0, 0, 4.0], body)),
    // 水平尾翼
    colorize(hexToRgb('#cccccc'), translate([0, 56, tailplaneHeight], horizontalTailplane)),
    // 垂直尾翼
    colorize(hexToRgb('#cccccc'), translate([0, 54, tailplaneHeight], verticalTailplane)),
    // テールローター
    colorize(hexToRgb('#cccccc'), translate([-1, 61, tailplaneHeight + 9], tailRotor)),
    // メインローター
    colorize(hexToRgb('#cccccc'), translate([0, 4, 20.5], mainRotor)),
    colorize(hexToRgb('#cccccc'), translate([0, 4, 20.5], mainRotorHead)),
    colorize(hexToRgb('#888888'), translate([0, 4, 20.5], mainRotorShaft)),
    // フロントタイヤ
    colorize(hexToRgb('#cccccc'), translate([-frontTirePosition[1], frontTirePosition[2], frontTirePosition[0]], frontWheel)),
    colorize(hexToRgb('#cccccc'), translate([frontTirePosition[1], frontTirePosition[2], frontTirePosition[0]], frontWheel)),
    colorize(hexToRgb('#000000'), translate([-frontTirePosition[1], frontTirePosition[2], frontTirePosition[0]], frontTire)),
    colorize(hexToRgb('#000000'), translate([frontTirePosition[1], frontTirePosition[2], frontTirePosition[0]], frontTire)),
    colorize(hexToRgb('#888888'), translate([0, -12, 0.9], frontLeg)),
    // リアタイヤ
    colorize(hexToRgb('#cccccc'), translate([-12, rearTirePosition[0], rearTirePosition[1]], rearWheel)),
    colorize(hexToRgb('#cccccc'), translate([12, rearTirePosition[0], rearTirePosition[1]], rearWheel)),
    colorize(hexToRgb('#000000'), translate([-12, rearTirePosition[0], rearTirePosition[1]], rearTire)),
    colorize(hexToRgb('#000000'), translate([12, rearTirePosition[0], rearTirePosition[1]], rearTire)),
    colorize(hexToRgb('#888888'), translate([-10.5, rearTirePosition[0], rearTirePosition[1]], rotate([Math.PI / 180 * 60,0,0], rearLeg))),
    colorize(hexToRgb('#888888'), translate([10.5, rearTirePosition[0], rearTirePosition[1]], rotate([Math.PI / 180 * 60,0,0], rearLeg))),
  ];
}

module.exports = { main }
