const prisma = require("./prismaClient");

module.exports.reportMessage = async function reportComment(messageId, user_id, description) {
  try {
    await prisma.$transaction(async (tx) => {
      // Check if the comment exists
      const messageExists = await tx.message.findUnique({
        where: { id: messageId },
      });
      if (!messageExists) {
        throw new Error("Message does not exist.");
      }

      // Check if the person exists
      const userExists = await tx.user.findUnique({
        where: { id: user_id },
      });
      if (!userExists) {
        throw new Error("User does not exist.");
      }

      // Create the report
      await tx.messageReport.create({
        data: { message_id: messageId, user_id: user_id, description },
      });
    });

    console.log("Message reported successfully!");
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("User has already reported this comment.");
    }
    throw error;
  }
};

module.exports.getReportCountByMessageId = function getReportCountByMassageId(messageId) {
  return prisma.messageReport.count({
    where: { message_id: parseInt(messageId, 10) },
  });
};

// Admin part
module.exports.getAllReports = function getAllReports() {
  return prisma.messageReport
    .findMany({
      include: {
        message: {
          include: {
            user: { select: { id: true, username: true, email: true } }, // User who created the comment
          },
        },
        user: { select: { id: true, username: true, email: true } }, // User who reported the comment
      },
    })
    .then((reports) => {
      console.log("Fetched reports with details:", reports);
      return reports;
    });
};
