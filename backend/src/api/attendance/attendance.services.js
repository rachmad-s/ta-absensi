const { db } = require("../../utils/db");
const moment = require("moment");

function createAttendance(payload) {
  return db.attendance.create({
    data: {
      date: new Date().toISOString(),
      type: payload.type,
      photoUrl: payload.photoUrl,
      status: payload.status,
      similarity: payload.similarity,
      user: {
        connect: {
          id: payload.userId
        }
      }
    },
  });
}

function updateAttendance(id, newData) {
  let data = {};
  if (newData.remarks) {
    data.remarks = newData.remarks;
    data.status = newData.status;
  }
  return db.attendance.update({
    where: { id },
    data,
  });
}

function createBulkAttendance(payload) {
  return db.attendance.createMany({
    data: payload,
  });
}

function getUserAttendanceByMonth(params) {
  const { userId, month, year } = params;
  const condition = {};

  const startDate = moment({
    month,
    date: "01",
    year,
  });
  const endDate = moment({
    month,
    date: moment({
      month,
      year,
    }).daysInMonth(),
    year,
  });

  condition.date = {
    gte: startDate.startOf("D").toISOString(),
    lte: endDate.endOf("D").toISOString(),
  };

  return db.attendance.findMany({
    where: {
      AND: [{ userId: userId }, { ...condition }],
    },
    select: {
      date: true,
      photoUrl: true,
      type: true,
      id: true,
      status: true,
      remarks: true
    },
  });
}

function getUserAttendanceByDate(params) {
  const { userId, year, month, date } = params;

  const fullDate = moment({
    year,
    month,
    date,
  });

  const condition = {};

  const range = {
    startTime: moment(fullDate).startOf("D").toISOString(),
    endTime: moment(fullDate).endOf("D").toISOString(),
  };
  condition.date = {
    gte: range.startTime,
    lte: range.endTime,
  };

  return db.attendance.findMany({
    where: {
      AND: [{ userId }, { ...condition }],
    },
  });
}

function getAllAttendanceByDate(params) {
  const { year, month, date } = params;

  const fullDate = moment({
    year,
    month,
    date,
  });

  const condition = {};

  const range = {
    startTime: moment(fullDate).startOf("D").toISOString(),
    endTime: moment(fullDate).endOf("D").toISOString(),
  };
  condition.date = {
    gte: range.startTime,
    lte: range.endTime,
  };

  return db.attendance.findMany({
    where: {
      AND: [{ ...condition }],
    },
  });
}

function getAllAttendance({ userId, month, year, status, departmentId, teamId, withoutMe, myId, type }) {
  const condition = {};

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

  if (userId) {
    condition.userId = userId
  }

  if (status) {
    condition.status = status
  }

  if (type) {
    condition.type = status
  }

  if (month) {
    condition.date = {
      gte: monthStart,
      lte: monthEnd,
    }
  }

  if (year) {
    condition.date = {
      gte: startOfYear,
      lte: endOfYear,
    }
  }

  if (withoutMe) {
    condition.user = {
      NOT: {
        id: myId,
      },
    }
  }

  if (departmentId) {
    condition.user = {
      profile: {
        team: {
          department: {
            id: departmentId
          }
        }
      }
    }
  }

  if (teamId) {
    condition.user = {
      profile: {
        team: {
          id: teamId
        }
      }
    }
  }

  return db.attendance.findMany({
    where: {
      AND: [{ ...condition }],
    },
    orderBy: {
      date: "desc",
    },
    include: {
      user: {
        include: {
          profile: {
            include: {
              team: {
                include: {
                  department: true
                }
              }
            }
          }
        }
      }
    }
  })
}

module.exports = {
  createAttendance,
  createBulkAttendance,
  getUserAttendanceByDate,
  getUserAttendanceByMonth,
  updateAttendance,
  getAllAttendanceByDate,
  getAllAttendance
};
