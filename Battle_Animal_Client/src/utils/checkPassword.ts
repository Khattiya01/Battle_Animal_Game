import bcrypt from "bcrypt";

export async function checkPassword({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
