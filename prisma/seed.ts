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

  const getOrCreateProfessor = async (name: string) => {
    let p = await prisma.professor.findFirst({ where: { name } });
    if (!p) p = await prisma.professor.create({ data: { name } });
    return p;
  };

  const walker = await getOrCreateProfessor("Walker White");
  const ken = await getOrCreateProfessor("Ken Birman");
  const adrian = await getOrCreateProfessor("Adrian Sampson");

  await prisma.review.createMany({
    data: [
      { professorId: walker.id, rating: 5, comment: "Great lecturer. Clear and engaging.", courseTag: "CS 3780" },
      { professorId: walker.id, rating: 4, comment: "Assignments are fair. Office hours are helpful.", courseTag: "CS 3780" },
      { professorId: ken.id, rating: 5, comment: "Brilliant professor. Tough but rewarding.", courseTag: "CS 3410" },
      { professorId: ken.id, rating: 4, comment: "Lots of material but well organized.", courseTag: "CS 3410" },
      { professorId: adrian.id, rating: 5, comment: "Very clear explanations. Highly recommend.", courseTag: "CS 3410" },
      { professorId: adrian.id, rating: 4, comment: "Good course. Labs were useful.", courseTag: "CS 3410" },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed: courses, professors, and sample reviews created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
