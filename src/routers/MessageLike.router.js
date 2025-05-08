const express = require("express");
const router = express.Router();
const { likeMessage, getLikeCountByMessageId } = require("../models/MessageLike.model");

function checkSession(req, res, next) {
  const user_id = req.session?.user_id;
  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }
  req.user_id = user_id;
  next();
}
router.post("/:messageId/like", checkSession, async (req, res, next) => {
  const { messageId } = req.params;
  const { user_id } = req.body;

  try {
    await likeMessage(parseInt(messageId, 10), user_id);
    const likeCount = await getLikeCountByMessageId(parseInt(messageId, 10));
    res.status(200).json({ likeCount }); // Return the updated like count
  } catch (error) {
    next(error);
  }
});

router.get("/:messageId/like-count", async (req, res, next) => {
  const { messageId } = req.params;

  try {
    const likeCount = await getLikeCountByMessageId(parseInt(messageId, 10));
    res.status(200).json({ likeCount });
  } catch (error) {
    console.error("Error fetching like count:", error);
    res.status(500).json({ error: "Failed to fetch like count" });
  }
});

module.exports = router;
