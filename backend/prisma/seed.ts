import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcrypt");
const { getRandomRolor } = require("../src/utils/helper");

const prisma = new PrismaClient();
async function main() {
  const amanda = await prisma.user.upsert({
    where: { email: "amanda@ab.net" },
    update: {},
    create: {
      email: "amanda@ab.net",
      password: bcrypt.hashSync("123123", 12),
      role: "ADMIN",
      profile: {
        create: {
          name: "Amanda P",
          avatarUrl: `https://ui-avatars.com/api/?background=${getRandomRolor()}&color=fff&name=Amanda+P`,
          address: "Jl Jakarta Raya 12 No 198",
          dob: "12/12/1998",
          position: "Head Of ADT Engineering",
          level: 5,
          team: {
            connectOrCreate: {
              where: { name: "ADT Engineering" },
              create: {
                name: "ADT Engineering",
                department: {
                  connectOrCreate: {
                    where: {
                      name: "IT",
                    },
                    create: {
                      name: "IT",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const john = await prisma.user.upsert({
    where: { email: "john@ab.net" },
    update: {},
    create: {
      email: "john@ab.net",
      password: bcrypt.hashSync("123123", 12),
      role: "USER",
      supervisor: {
        connect: {
          email: "amanda@ab.net",
        },
      },
      profile: {
        create: {
          name: "John S",
          avatarUrl: `https://ui-avatars.com/api/?background=${getRandomRolor()}&color=fff&name=John+S`,
          address: "Jl Bekasi Timur 12 No 198",
          dob: "14/05/2000",
          position: "Senior Frontend Engineer",
          level: 4,
          team: {
            connectOrCreate: {
              where: { name: "ADT Engineering" },
              create: {
                name: "ADT Engineering",
                department: {
                  connectOrCreate: {
                    where: {
                      name: "IT",
                    },
                    create: {
                      name: "IT",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const putri = await prisma.user.upsert({
    where: { email: "putri@ab.net" },
    update: {},
    create: {
      email: "putri@ab.net",
      password: bcrypt.hashSync("123123", 12),
      role: "HR",
      profile: {
        create: {
          name: "Putri A",
          avatarUrl: `https://ui-avatars.com/api/?background=${getRandomRolor()}&color=fff&name=Putri+A`,
          address: "Jl Bandung Raya 19 No 198",
          dob: "07/12/1999",
          position: "Head Of HRD",
          level: 5,
          team: {
            connectOrCreate: {
              where: { name: "Human Resource Development" },
              create: {
                name: "Human Resource Development",
                department: {
                  connectOrCreate: {
                    where: {
                      name: "Human Resource",
                    },
                    create: {
                      name: "Human Resource",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  console.log({ amanda, john, putri });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
