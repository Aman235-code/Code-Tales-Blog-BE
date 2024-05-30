const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");

// create
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    return res.status(200).json(savedComment);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get all comments of particular post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });

    if (!comments) {
      res.status(404).json("Comments Not Found");
    }
    res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
