const { db } = require("../../utils/db");

function getSupervisors() {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      profile: {
        select: {
          level: true,
          name: true,
          position: true,
          team: true,
        },
      },
    },
    where: {
      profile: {
        level: {
          gte: 3,
        },
      },
    },
  });
}

module.exports = {
  getSupervisors,
};
