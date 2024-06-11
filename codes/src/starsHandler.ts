type Inputs = Readonly<{ 
  chinaName: string;
  chinaRows: Record<string, unknown>[];
  internationalRows: Record<string, unknown>[];
  fields: string[];
}>;

type Outputs = Readonly<{ 
  rows: Record<string, unknown>[];
  fields: string[];
}>;

export function insertCnStarNames(inputs: Inputs): Outputs {
  const { chinaRows, internationalRows } = inputs;
  const chinaNameKey = inputs.chinaName;
  const hip2ChinaNames = new Map<string, string>();

  for (const row of chinaRows) {
    const hip = row["HIP"];
    const name = row["中国星名"];
    if (name && hip && hip !== "?") {
      const hips = `${hip}`.match(/\d+/g);
      if (hips) {
        for (const hip of hips) {
          hip2ChinaNames.set(hip, `${name}`);
        }
      }
    }
  }
  const rows: Record<string, unknown>[] = [];
  const fields = [chinaNameKey, ...inputs.fields];

  for (const row of internationalRows) {
    const hip = row["hip"];
    const chinaName = hip2ChinaNames.get(`${hip}`);

    if (!chinaName) {
      continue;
    }
    console.log("chinaName", hip, chinaName);
    rows.push({ ...row, [chinaNameKey]: chinaName });
  }
  return { fields, rows };
};