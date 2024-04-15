const { db } = require("../../utils/db");
const moment = require("moment");

/**
 *  SETTLE TIME OFF
 */

function settleTimeOf({ requestId, status, remarks, createdBy }) {
  return db.requestActions.create({
    data: {
      status,
      remarks,
      user: {
        connect: {
          id: createdBy,
        },
      },
      timeOffRequest: {
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

function getTimeOff({
  userId,
  teamId,
  departmentId,
  type,
  status,
  year,
  subordinate,
  myId,
  month,
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
        startDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      search && {
        user: {
          profile: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
      type && {
        type,
      },
      status && {
        requestActions: {
          some: {
            status,
            user: { role: "HR" },
          },
        },
      },
      userId && {
        user: { id: userId },
      },
      subordinate && {
        user: {
          supervisorId: myId,
        },
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

  return db.timeOffRequest.findMany({
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

function createTimeOff({ type, attachment, message, userId, days, startDate }) {
  return db.timeOffRequest.create({
    data: {
      type,
      attachment,
      message,
      days,
      startDate,
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

function updateTimeOff({ requestId, type, attachment, message }) {
  return db.timeOffRequest.update({
    where: {
      id: requestId,
    },
    data: {
      type,
      attachment,
      message,
    },
  });
}

/**
 *  DELETE A TIME OFF
 */

function deleteTimeOff({ requestId }) {
  return db.timeOffRequest.delete({
    where: {
      id: requestId,
    },
  });
}

module.exports = {
  settleTimeOf,
  getTimeOff,
  createTimeOff,
  updateTimeOff,
  deleteTimeOff,
};
