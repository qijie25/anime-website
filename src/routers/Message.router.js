const express = require('express');
const router = express.Router();
const { createMessage, getAllMessages, updateMessage, deleteMessage } = require("../models/Message.model");

router.post('/', checkSession, (req, res, next) => {
    const { user_id, text, parent_id } = req.body;
    createMessage(user_id, text, parent_id)
        .then((message) => res.status(201).json(message))
        .catch(next);
});

router.get("/", (req, res, next) => {
  const user_id = req.session?.user_id || null;

  getAllMessages()
    .then((messages) => res.status(200).json({ messages, user_id }))
    .catch(next);
});

function checkSession(req, res, next) {
  const user_id = req.session?.user_id;
  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }
  req.user_id = user_id;
  next();
}

router.put("/:id", checkSession, (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  updateMessage(parseInt(id), data, req.user_id)
    .then((message) => res.status(200).json(message))
    .catch(next);
});

router.delete("/:id", checkSession, (req, res, next) => {
  const { id } = req.params;
  deleteMessage(parseInt(id), req.user_id)
    .then((message) => res.status(200).json(message))
    .catch(next);
});

module.exports = router;