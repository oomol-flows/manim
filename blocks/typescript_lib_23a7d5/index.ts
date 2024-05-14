import type { VocanaSDK } from "@vocana/sdk";

type Context = VocanaSDK<Inputs, Outputs>;
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

export default async function(inputs: Inputs, context: Context) {
  const { chinaRows, internationalRows } = inputs;
  const chinaNameKey = inputs.chinaName;
  const hip2ChinaNames = new Map<string, string>();

  for (const row of chinaRows) {
    const hip = row["HIP"] as string;
    const name = row["中国星名"] as string;
    if (name && hip) {
      hip2ChinaNames.set(hip, name);
    }
  }
  const rows: Record<string, unknown>[] = [];
  const fields = [chinaNameKey, ...inputs.fields];

  for (const row of internationalRows) {
    const hip = row["hip"];
    if (!hip) {
      continue;
    }
    const chinaName = hip2ChinaNames.get(`${hip}`);
    if (!chinaName) {
      continue;
    }
    rows.push({ ...row, [chinaNameKey]: chinaName });
  }
  context.output(fields, "fields", false);
  context.output(rows, "rows", false);
  context.done();
};