const bcrypt = require("bcrypt");
const { db } = require("../../utils/db");
const { getRandomRolor } = require("../../utils/helper");

function findUserByEmail(email) {
  return db.user.findUnique({
    select: {
      email: true,
      password: true,
      id: true,
      role: true,
      profile: true,
      supervising: true,
      supervisorId: true,
    },
    where: {
      email,
    },
  });
}

function createUserByEmailAndPassword(user) {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({
    data: {
      email: user.email,
      password: user.password,
      role: user.role,
      supervisor: {
        connect: user.supervisorId
          ? {
              id: user.supervisorId,
            }
          : undefined,
      },
      profile: {
        create: {
          level: user.level,
          name: user.name,
          address: user.address,
          avatarUrl: `https://ui-avatars.com/api/?background=${getRandomRolor()}&color=fff&name=${user.name.replace(
            " ",
            "+"
          )}`,
          position: user.position,
          address: user.address,
          team: {
            connect: {
              id: user.team,
            },
          },
        },
      },
    },
  });
}

function findUserById(id) {
  return db.user.findUnique({
    where: {
      id,
    },
    include: {
      supervising: {
        include: {
          profile: true,
        },
      },
      supervisor: {
        include: {
          profile: true,
        },
      },
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
  });
}

function getUsers(params) {
  const where = [];

  if (params.department)
    where.push({
      profile: {
        team: {
          department: {
            id: params.department,
          },
        },
      },
    });
  if (params.team)
    where.push({
      profile: {
        team: {
          id: params.team,
        },
      },
    });
  if (params.role) where.push({ role: params.role });
  if (params.filter)
    where.push({
      OR: [
        {
          email: {
            contains: params.filter,
            mode: "insensitive",
          },
        },
        {
          profile: {
            name: {
              contains: params.filter,
              mode: "insensitive",
            },
          },
        },
      ],
    });

  return db.user.findMany({
    skip: params.skip,
    take: params.take,
    orderBy: { [params.sort]: params.direction },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      supervisor: {
        include: {
          profile: true,
        },
      },
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
    where: {
      AND: [
        ...where,
        {
          NOT: {
            email: "admin@ab.net",
          },
        },
      ],
    },
  });
}

function getUsersCount(params) {
  const where = [];

  if (params.department)
    where.push({
      profile: {
        team: {
          department: {
            id: params.department,
          },
        },
      },
    });
  if (params.team)
    where.push({
      profile: {
        team: {
          id: params.team,
        },
      },
    });
  if (params.role) where.push({ role: params.role });
  if (params.filter)
    where.push({
      OR: [
        {
          email: {
            contains: params.filter,
            mode: "insensitive",
          },
        },
        {
          profile: {
            name: {
              contains: params.filter,
              mode: "insensitive",
            },
          },
        },
      ],
    });

  return db.user.count({
    where: {
      AND: [...where],
    },
  });
}

function updateUser(id, newData) {
  return db.user.update({
    where: { id },
    data: {
      role: newData.role,
      email: newData.email,
      supervisor: {
        connect: newData.supervisorId
          ? {
              id: newData.supervisorId,
            }
          : undefined,
      },
      profile: {
        upsert: {
          create: {
            level: newData.level,
            name: newData.name,
            address: newData.address,
            position: newData.position,
            team: {
              connect: {
                id: newData.team,
              },
            },
          },
          update: {
            avatarUrl: newData.avatarUrl ? newData.avatarUrl : undefined, 
            level: newData.level || undefined,
            name: newData.name || undefined,
            address: newData.address || undefined,
            position: newData.position || undefined,
            team: newData.team ? {
              connect: {
                id: newData.team,
              },
            } : undefined,
          },
        },
      },
    },
    include: {
      profile: true,
      supervisor: true,
    },
  });
}

function deleteUser(id) {
  return db.user.delete({
    where: { id },
    include: {
      profile: true,
      requests: true,
      attendances: true,
    },
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  getUsers,
  updateUser,
  deleteUser,
  getUsersCount,
};
