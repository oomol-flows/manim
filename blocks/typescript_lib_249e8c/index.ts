import type { VocanaSDK } from "@vocana/sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ 
  rows: Row[];
  "模式": "平面投影" | "球面投影";
  x: Vector;
  y: Vector;
  z: Vector;
}>;

type Outputs = Readonly<{ 
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

export default async function(inputs: Inputs, context: Context) {
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
  context.output(toRows, "rows");
  context.output(isDegree, "isDegree");
  context.done();
};

function transformCoordinate(row: Row, { x, y, z }: Inputs): Vector {
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