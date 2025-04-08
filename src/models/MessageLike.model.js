const prisma = require("./prismaClient");

module.exports.likeMessage = async function likeMessage(messageId, user_id) {
  try {
    await prisma.$transaction(async (tx) => {
      // Attempt to create a like
      await tx.messageLike.create({
        data: {
          message_id: messageId,
          user_id: user_id,
        },
      });
    });

    console.log("Message liked successfully!");
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation
      throw new Error("User has already liked this message.");
    } else {
      console.error("Error liking the message:", error);
      throw error;
    }
  }
};

module.exports.getLikeCountByMessageId = function getLikeCountByMessageId(messageId) {
  return prisma.messageLike.count({
    where: { message_id: parseInt(messageId, 10) },
  });
};
