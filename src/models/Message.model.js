const prisma = require("./prismaClient");

module.exports.createMessage = function createMessage(user_id, text) {
  const data = {
    text,
  };

  if (user_id) {
    data.user = { connect: { id: user_id } };
  }

  return prisma.message.create({
    data,
  });
};

module.exports.getAllMessages = async function getAllMessages() {
  const messages = await prisma.message.findMany({
    select: {
      id: true,
      text: true,
      created_at: true,
      user: { select: { id: true, username: true, email: true, profile_imgs: true } },
    },
    orderBy: { created_at: "asc" },
  });

    // Fetch likes for all comments
    const messageIds = messages.map((message) => message.id);
    const likes = await prisma.messageLike.groupBy({
      by: ["message_id"],
      where: { message_id: { in: messageIds } },
      _count: { id: true },
    });

    // Attach like counts to comments
    const likeCounts = likes.reduce((acc, like) => {
      acc[like.message_id] = like._count.id;
      return acc;
    }, {});

    return messages.map((message) => ({
      ...message,
      likeCount: likeCounts[message.id] || 0, // Default to 0 if no likes
    }));
};

module.exports.updateMessage = async function updateMessage(id, data, user_id) {
  const message = await prisma.message.findUnique({ where: { id } });

  if (!message) {
    throw new Error("Message not found");
  }

  // Check ownership rights
  if (user_id && message.user_id !== user_id) {
    throw new Error("Unauthorized to update this message");
  }

  return prisma.message.update({
    where: { id },
    data,
  });
};

module.exports.deleteMessage = async function deleteMessage(id, user_id) {
  const message = await prisma.message.findUnique({ where: { id } });

  if (!message) {
    throw new Error("Message not found");
  }

  // Check ownership rights
  if (user_id && message.user_id !== user_id) {
    throw new Error("Unauthorized to delete this message");
  }

  return prisma.message.delete({
    where: { id },
  });
};
