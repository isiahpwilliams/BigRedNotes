import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.course.upsert({
      where: { subjectCode_courseNumber: { subjectCode: "CS", courseNumber: "3780" } },
      update: {},
      create: { subjectCode: "CS", courseNumber: "3780", name: "Data Science" },
    }),
    prisma.course.upsert({
      where: { subjectCode_courseNumber: { subjectCode: "PSYCH", courseNumber: "1101" } },
      update: {},
      create: { subjectCode: "PSYCH", courseNumber: "1101", name: "Introduction to Psychology" },
    }),
    prisma.course.upsert({
      where: { subjectCode_courseNumber: { subjectCode: "CS", courseNumber: "3410" } },
      update: {},
      create: { subjectCode: "CS", courseNumber: "3410", name: "Computer System Organization" },
    }),
  ]);

  console.log("Seed completed: courses created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
