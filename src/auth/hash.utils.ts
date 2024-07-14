import * as bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  console.log(`Comparing password: ${password} with hash: ${hash}`);
  const result = await bcrypt.compare(password, hash);
  console.log(`Compare result: ${result}`);
  return result;
}
