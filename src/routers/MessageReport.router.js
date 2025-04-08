const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { reportMessage, getReportCountByMessageId } = require("../models/MessageReport.model");

router.post("/:messageId/report", async (req, res, next) => {
  const { messageId } = req.params;
  const { user_id, description } = req.body;

  if (!description || description.trim() === "") {
    return res.status(400).json({ error: "Description is required to report a message." });
  }

  try {
    await reportMessage(parseInt(messageId, 10), user_id, description);
    const reportCount = await getReportCountByMessageId(parseInt(messageId, 10));
    res.status(200).json({ message: "Message reported successfully", reportCount });
  } catch (error) {
    console.error("Error reporting the message:", error);
    next(error);
  }
});

router.get("/:messageId/report-count", async (req, res, next) => {
  const { messageId } = req.params;

  try {
    const reportCount = await getReportCountByMessageId(parseInt(messageId, 10));
    res.status(200).json({ reportCount });
  } catch (error) {
    console.error("Error fetching report count:", error);
    res.status(500).json({ error: "Failed to fetch report count" });
  }
});

module.exports = router;
