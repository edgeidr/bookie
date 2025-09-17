import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding done");
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});
