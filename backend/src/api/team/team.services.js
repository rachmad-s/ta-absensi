const bcrypt = require("bcrypt");
const { db } = require("../../utils/db");

function createTeam(payload) {
  return db.team.create({
    data: payload,
  });
}

function findTeamById(id) {
  return db.team.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      departmentId: true,
      department: true,
      profiles: true,
    },
  });
}

function getTeams(params) {
  const whereAnd = [];

  if (params.name)
    whereAnd.push({
      name: {
        contains: params.name,
      },
    });

  if (params.departmentId)
    whereAnd.push({
      department: {
        id: params.departmentId,
      },
    });

  return db.team.findMany({
    orderBy: { [params.sort]: params.direction },
    include: { department: true, _count: true },
    where: {
      AND: whereAnd,
    },
  });
}

function updateTeam(id, newData) {
  let data = {};
  if (newData.name) {
    data.name = newData.name;
  }
  if (newData.departmentId) {
    data.departmentId = newData.departmentId;
  }
  return db.team.update({
    where: { id },
    data,
  });
}

function deleteTeam(id) {
  return db.team.delete({
    where: { id },
  });
}

module.exports = {
  findTeamById,
  createTeam,
  getTeams,
  updateTeam,
  deleteTeam,
};
