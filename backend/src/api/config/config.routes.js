const express = require("express");
const { isAuthenticated } = require("../../middlewares");
const {
  getAllConfigs,
  findConfigByName,
  updateConfig,
} = require("./config.services");

const router = express.Router();

/**
 *  GET ALL CONFIGS
 */
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const configs = await getAllConfigs();
    res.json(configs);
  } catch (err) {
    next(err);
  }
});

/**
 *  GET CONFIG BY NAME
 */
router.get("/:name", isAuthenticated, async (req, res, next) => {
  try {
    const name = req.params.name;

    const config = await findConfigByName({ name });
    res.json(config);
  } catch (err) {
    next(err);
  }
});

/**
 *  UPDATE CONFIGS
 */
router.put("/:name", isAuthenticated, async (req, res, next) => {
  try {
    const name = req.params.name;

    const config = await updateConfig({
      name,
      value: req.body.value,
      isActive: req.body.isActive,
    });
    res.json(config);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
