const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const { storage } = require('../../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

const router = express.Router();

router.post("/attendance", isAuthenticated, upload.single('image'), async (req, res, next) => {
  try {
    console.log(req.file)
    res.json(req.file);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
