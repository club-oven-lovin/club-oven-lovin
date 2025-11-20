import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }

  // Seed VENDORS
  if (config.defaultVendors) {
    for (const vendor of config.defaultVendors) {
      console.log(`  Creating vendor for: ${vendor.owner}`);

      await prisma.vendor.upsert({
        where: { owner: vendor.owner },
        update: {},
        create: {
          owner: vendor.owner,
          name: vendor.name,
          address: vendor.address,
          hours: vendor.hours,
        },
      });
    }
  }

  // Seed INGREDIENTS
  if (config.defaultIngredients) {
    for (const ing of config.defaultIngredients) {
      console.log(`  Creating ingredient: ${ing.name}`);

      const vendor = await prisma.vendor.findFirst({
        where: { name: ing.vendorName },
      });

      if (!vendor) {
        console.log(`  ⚠ Skipping "${ing.name}" because vendor "${ing.vendorName}" not found`);
        continue;
      }

      await prisma.ingredient.create({
        data: {
          owner: ing.owner,
          name: ing.name,
          price: ing.price,
          size: ing.size,
          available: ing.available,
          vendorId: vendor.id,
        },
      });
    }
  }
}


main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
