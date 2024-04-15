const { db } = require("../../utils/db");

/**
 *  GET ALL CONFIGS
 */
function getAllConfigs() {
  return db.config.findMany();
}

/**
 *  FIND CONFIG BY NAME
 */
function findConfigByName({ name }) {
  return db.config.findFirst({
    where: {
      name,
    },
  });
}

/**
 *  UPDATE CONFIG
 */
function updateConfig({ name, value, isActive }) {
  return db.config.update({
    where: {
      name,
    },
    data: {
      value,
      isActive,
    },
  });
}

module.exports = {
  getAllConfigs,
  findConfigByName,
  updateConfig,
};
