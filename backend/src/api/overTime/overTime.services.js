const { db } = require("../../utils/db");
const moment = require("moment");

/**
 *  SETTLE TIME OFF
 */

function settleOverTime({ requestId, status, remarks, createdBy }) {
  return db.requestActions.create({
    data: {
      status,
      remarks,
      user: {
        connect: {
          id: createdBy,
        },
      },
      overTimeRequest: {
        connect: {
          id: requestId,
        },
      },
    },
  });
}

/**
 *  FIND TIME OFFS
 */

function getOverTime({
  userId,
  teamId,
  departmentId,
  subordinate,
  myId,
  month,
  year,
  search,
  withoutMe,
}) {
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

  const where = {
    AND: [
      {
        createdAt: { gte: startOfYear, lte: endOfYear },
      },
      withoutMe && {
        user: {
          NOT: {
            id: myId,
          },
        },
      },
      month && {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      userId && {
        user: { id: userId },
      },
      search && {
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      subordinate && {
        user: { supervisorId: myId },
      },
      teamId && {
        user: {
          profile: {
            team: { id: teamId },
          },
        },
      },
      departmentId && {
        user: {
          profile: {
            team: {
              department: { id: departmentId },
            },
          },
        },
      },
    ].filter((w) => !!w),
  };

  return db.overTimeRequest.findMany({
    include: {
      requestActions: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      user: {
        include: {
          profile: {
            include: {
              team: {
                include: {
                  department: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where,
  });
}

/**
 *  CREATE A TIME OFF
 */

function createOverTime({ message, userId, date, duration }) {
  return db.overTimeRequest.create({
    data: {
      message,
      date,
      duration,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

/**
 *  UPDATE A TIME OFF
 */

function updateOverTime({ requestId, date, message, duration }) {
  return db.overTimeRequest.update({
    where: {
      id: requestId,
    },
    data: {
      duration,
      message,
      date,
    },
  });
}

/**
 *  DELETE A TIME OFF
 */

function deleteOverTime({ requestId }) {
  return db.overTimeRequest.delete({
    where: {
      id: requestId,
    },
  });
}

module.exports = {
  settleOverTime,
  getOverTime,
  createOverTime,
  updateOverTime,
  deleteOverTime,
};
