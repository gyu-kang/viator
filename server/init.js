const { prisma } = require("./generated/prisma-client");
const password = require("./password");

const createUser = async () => {
  const { ADMIN_ID, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_ID || !ADMIN_PASSWORD) {
    throw new Error("Enter 'ADMIN_ID' and 'ADMIN_PASSWORD' correctly.");
  }

  const passwordSalt = await password.generateSalt();
  const hashedPassword = await password.hash(ADMIN_PASSWORD, passwordSalt);

  await prisma.createUser({
    name: ADMIN_ID,
    password: hashedPassword,
    passwordSalt,
  });
};

createUser()
  .then(() => console.log("Admin created successfully!"))
  .catch((error) => console.log(error.message));
