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
  x0: number; // 轴指向春分点
  y0: number; // 轴指向赤经 6 小时（赤纬 0）
  z0: number; // 轴指向北天极
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
    if (p.z <= 0) {
      continue;
    }
    let x = 0.0;
    let y = 0.0;

    switch (mode) {
      case "平面投影": {
        x = p.x / p.z;
        y = p.y / p.z;
        break;
      }
      case "球面投影": {
        const rx = Math.sqrt(p.x ** 2 + p.z ** 2);
        const ry = Math.sqrt(p.y ** 2 + p.z ** 2);
        x = Math.asin(p.x / rx) * 180 / Math.PI;
        y = Math.asin(p.y / ry) * 180 / Math.PI;
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

function transformCoordinate({ x0, y0, z0 }: Row, { x, y, z }: Inputs): Vector {
  const starVector: Vector = { x: x0, y: y0, z: z0 };
  const toVector: Vector = {
    x: dotProduct(starVector, x),
    y: dotProduct(starVector, y),
    z: dotProduct(starVector, z),
  };
  return toVector;
}

function dotProduct(v1: Vector, v2: Vector): number {
  return v1.x * v2.x + v1.y * v2.y + v2.z * v2.z;
}