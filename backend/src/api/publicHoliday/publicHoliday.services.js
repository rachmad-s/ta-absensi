const { db } = require("../../utils/db");
const moment = require("moment");

function createPublicHoliday(payload) {
  return db.publicHoliday.create({
    data: payload,
  });
}

function getPublicHoliday({ name, year, month, sort, direction }) {
  const startOfYear = moment({ year }).startOf("y").toDate();
  const endOfYear = moment({ year }).endOf("y").toDate();
  const monthStart =
    month &&
    moment({ month: month || 0, year })
      .startOf("M")
      .toDate();
  const monthEnd =
    month &&
    moment({ month: month || 0, year })
      .endOf("M")
      .toDate();
  const whereClause = {
    date: {
      gte: startOfYear,
      lte: endOfYear,
    },
  };

  if (name) {
    whereClause.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (month) {
    whereClause.date = {
      gte: monthStart,
      lte: monthEnd,
    };
  }

  return db.publicHoliday.findMany({
    orderBy: { [sort]: direction },
    where: whereClause,
  });
}

function updatePublicHoliday(id, newData) {
  let data = newData;
  return db.publicHoliday.update({
    where: { id },
    data,
  });
}

function deletePublicHoliday(id) {
  return db.publicHoliday.delete({
    where: { id },
  });
}

module.exports = {
  createPublicHoliday,
  getPublicHoliday,
  updatePublicHoliday,
  deletePublicHoliday,
};
