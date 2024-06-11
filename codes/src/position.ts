type ObserverInputs = Readonly<{ 
  "赤经": number;
  "赤纬": number;
 }>;

type ObserverOutputs = Readonly<{ 
  x: Vector;
  y: Vector;
  z: Vector;
}>;

type PointsInputs = Readonly<{ 
  rows: Row[];
  "模式": "平面投影" | "球面投影";
  x: Vector;
  y: Vector;
  z: Vector;
}>;

type PointsOutputs = Readonly<{ 
  rows: ProjectionRow[];
  isDegree: boolean;
 }>;

type Row = {
  cnn: string;
  x0: string; // 轴指向春分点
  y0: string; // 轴指向赤经 6 小时（赤纬 0）
  z0: string; // 轴指向北天极
  mag: string; // 视星等
};

type Vector = {
  x: number;
  y: number;
  z: number;
};

type ProjectionRow = {
  cnn: string;
  mag: number;
  // 指向东方
  x: number;
  // 指向北方
  y: number;
};

export function getObserverCoordinateSystem(inputs: ObserverInputs): ObserverOutputs {
  const ra = inputs["赤经"] * Math.PI / 180;
  const dec = inputs["赤纬"] * Math.PI / 180;
  const vx = xVector(ra);
  const vy = yVector(ra, dec);
  const vz = zVector(ra, dec);

  return {
    x: vx,
    y: vy,
    z: vz,
  };
};

export function to2DPoints(inputs: PointsInputs): PointsOutputs {
  const toRows: ProjectionRow[] = [];
  const mode = inputs["模式"];
  const isDegree = mode === "球面投影";

  for (const row of inputs.rows) {
    const p = transformCoordinate(row, inputs);

    if (Number.isNaN(p.x) || Number.isNaN(p.y) || Number.isNaN(p.y)) {
      // 原始数据可能出现空字符串，这将解析成 NaN
      continue;
    }
    let x = 0.0;
    let y = 0.0;

    switch (mode) {
      case "平面投影": {
        if (p.z < 0.0) {
          continue;
        }
        x = p.x / p.z;
        y = p.y / p.z;
        break;
      }
      case "球面投影": {
        // 在地平投影上的极坐标角度
        const theta = Math.atan2(p.y, p.x);
        // 在地平投影上向量的长度
        const pr = Math.sqrt(p.x ** 2 + p.y ** 2);
        // 恒星的距离
        const distance = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
        
        let r = Math.asin(pr / distance);

        if (p.z < 0) {
          r = Math.PI - r;
        }
        x = theta * 180 / Math.PI;
        y = r * 180 / Math.PI;
        break;
      }
    }
    const projectionRow: ProjectionRow = {
      x,
      y,
      mag: Number.parseFloat(row.mag),
      cnn: row.cnn,
    };
    toRows.push(projectionRow);
  }
  return {
    rows: toRows,
    isDegree,
  };
};

// 沿着纬线圈逆时钟（北天极俯视）方向。即，指向东方
function xVector(ra: number): Vector {
  // 由于纬线圈在与 z 轴垂直的平面中，故该向量在 z 轴没有分量
  // x^2 + y^2 = 1
  // z = 0
  const x = - Math.sin(ra);
  const y = Math.cos(ra);
  const z = 0.0;

  return { x, y, z };
}

// 指向北方，即便在北极、南极，也可以根据 RA 给出有意义的值
function yVector(ra: number, dec: number): Vector {
  // 假设 k 是 (x, y) 向量的长度，可得如下方程组
  // z = k cot(Dec)
  // z^2 + k^2 = 1
  // x^2 + y^2 = k^2
  if (dec === 0.0) {
    // cot(Dec) 无意义的值，刚好在赤道，直接根据定义给出
    return { x: 0.0, y: 0.0, z: 1.0 };
  }
  const k = 1.0 / Math.sqrt(1.0 + 1.0 / Math.tan(dec) ** 2);
  const z = k / Math.tan(dec);
  const x = - k * Math.cos(ra);
  const y = - k * Math.sin(ra);

  return { x, y, z };
}

// 指向天顶的单位向量
function zVector(ra: number, dec: number): Vector {
  // 方程组：
  // z = Sin(Dec)
  // x = k Cos(RA)
  // y = k Sin(RA)
  // x^2 + y^2 + z^2 = 1
  // k >= 0
  const z = Math.sin(dec);
  const k = Math.sqrt(1.0 - Math.sin(dec) ** 2);
  const x = k * Math.cos(ra);
  const y = k * Math.sin(ra);

  return { x, y, z };
}

function transformCoordinate(row: Row, { x, y, z }: PointsInputs): Vector {
  const starVector: Vector = {
    x: Number.parseFloat(row["x0"]),
    y: Number.parseFloat(row["y0"]),
    z: Number.parseFloat(row["z0"]),
  };
  const toVector: Vector = {
    x: dotProduct(starVector, x),
    y: dotProduct(starVector, y),
    z: dotProduct(starVector, z),
  };
  return toVector;
}

function dotProduct(v1: Vector, v2: Vector): number {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}