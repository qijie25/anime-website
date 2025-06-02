const prisma = require('./prismaClient');
const bcrypt = require('bcrypt');

module.exports.login = async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
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
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  return isPasswordValid;
};

module.exports.updateProfilePicture = async function updateProfilePicture(userId, imageUrl) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const now = new Date();
  const lastUpdate = user.lastProfilePictureUpdate;

  // Check if 24 hours have passed since the last update
  if (lastUpdate) {
    const timeSinceLastUpdate = now - lastUpdate;
    const timeRemaining = 24 * 60 * 60 * 1000 - timeSinceLastUpdate;

    if (timeRemaining > 0) {
      const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
      const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
      throw new Error(`You can change your profile picture again in ${hours}h ${minutes}m.`);
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      profile_imgs: { push: imageUrl }, // Append new image to array
      lastProfilePictureUpdate: now,
    },
  });
};

module.exports.getUserProfilePictures = async function getUserProfilePictures(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profile_imgs: true },
  });

  if (!user) throw new Error('User not found');

  return user.profile_imgs;
};
