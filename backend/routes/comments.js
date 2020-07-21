const express = require("express");

const CommentsController = require("../controllers/comments");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, CommentsController.createComment);

module.exports = router;
