const prisma = require("./prismaClient");

module.exports.createMessage = function createMessage(user_id, text, parent_id = null, anime_id = null) {
  const data = {
    text,
    user: { connect: { id: user_id } },
  };

  if (parent_id) {
    data.parent = { connect: { id: parent_id } };
  }

  if (anime_id) {
    data.anime = { connect: { id: anime_id } };
  }

  return prisma.message.create({
    data,
    include: {
      user: true,
    },
  });
};

module.exports.getAllMessages = async function getAllMessages() {
  const messages = await prisma.message.findMany({
    where: { parent_id: null },
    include: {
      user: {
        select: { id: true, username: true, email: true, profile_imgs: true },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              profile_imgs: true,
            },
          },
        },
      },
    },
    orderBy: { created_at: "asc" },
  });
  
  // Get all message and reply IDs
  const allMessageIds = messages.flatMap((message) => [
    message.id,
    ...message.replies.map((reply) => reply.id),
  ]);

  const likes = await prisma.messageLike.groupBy({
    by: ["message_id"],
    where: { message_id: { in: allMessageIds } },
    _count: { id: true },
  });

  const likeCounts = likes.reduce((acc, like) => {
    acc[like.message_id] = like._count.id;
    return acc;
  }, {});

  // Attach like counts to both messages and replies
  return messages.map((message) => ({
    ...message,
    likeCount: likeCounts[message.id] || 0,
    replies: message.replies.map((reply) => ({
      ...reply,
      likeCount: likeCounts[reply.id] || 0,
    })),
  }));
};

module.exports.getLatestMessagesByAnimeId = async function getLatestMessagesByAnimeId(anime_id, limit = 3) {
  const messages = await prisma.message.findMany({
    where: {
      parent_id: null,
      anime_id: anime_id,
    },
    orderBy: { created_at: 'desc' },
    take: limit,
    include: {
      user: {
        select: { id: true, username: true, profile_imgs: true },
      },
    },
  });

  return messages;
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

  return prisma.$transaction(async (tx) => {
    // First delete replies (if any)
    await tx.message.deleteMany({
      where: { parent_id: id },
    });

    // Then delete the parent message
    const deletedMessage = await tx.message.delete({
      where: { id },
    });

    return deletedMessage;
  });
};
