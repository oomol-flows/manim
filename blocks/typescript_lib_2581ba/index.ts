import type { VocanaSDK } from "@vocana/sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ 
  "赤经": number;
  "赤纬": number;
 }>;

type Outputs = Readonly<{ 
  x: Vector;
  y: Vector;
  z: Vector;
}>;

type Vector = {
  x: number;
  y: number;
  z: number;
};

export default async function(inputs: Inputs, context: Context) {
  const ra = inputs["赤经"] * Math.PI / 180;
  const dec = inputs["赤纬"] * Math.PI / 180;
  const vx = xVector(ra);
  const vy = yVector(ra, dec);
  const vz = zVector(ra, dec);

  void context.output(vx, "x", false);
  void context.output(vy, "y", false);
  void context.output(vz, "z", false);
  void context.done();
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