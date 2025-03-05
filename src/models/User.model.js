const prisma = require("./prismaClient");
const bcrypt = require("bcrypt");

module.exports.login = async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return user;
};

module.exports.register = async function register(username, email, password) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user in the database
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return newUser;
};

module.exports.updateProfile = async function updateProfile(id, updatedFields) {
  return prisma.user.update({
    where: { id },
    data: updatedFields,
  });
};

module.exports.verifyCurrentPassword = async function verifyCurrentPassword(id, currentPassword) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  return isPasswordValid;
};
