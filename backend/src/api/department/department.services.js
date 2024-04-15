const { db } = require("../../utils/db");

function createDepartment(payload) {
  return db.department.create({
    data: payload,
  });
}

function findDepartmentById(id) {
  return db.department.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

function getDepartments(params) {
  const whereClause = {};

  if (params.name) {
    whereClause.name = {
      contains: params.name,
    };
  }

  return db.department.findMany({
    orderBy: { [params.sort]: params.direction },
    where: whereClause,
    include: {
      _count: true,
      teams: {
        include: {
          _count: true,
        },
      },
    },
  });
}

function updateDepartment(id, newData) {
  let data = {};
  if (newData.name) {
    data.name = newData.name;
  }
  return db.department.update({
    where: { id },
    data,
  });
}

function deleteDepartment(id) {
  return db.department.delete({
    where: { id },
  });
}

module.exports = {
  findDepartmentById,
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
};
