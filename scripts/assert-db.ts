import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const accounts = await prisma.account.count();
  const sessions = await prisma.session.count();

  console.log(JSON.stringify({ users, accounts, sessions }, null, 2));

  if (users < 1 || accounts < 1 || sessions < 1) {
    process.exitCode = 2; // marcar fallo en CI si corresponde
  }
}

main().catch((e) => { console.error(e); process.exit(1); });