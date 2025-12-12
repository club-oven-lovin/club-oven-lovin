import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  await Promise.all(
    config.defaultAccounts.map(async (account) => {
      const role = (account.role as Role) || Role.USER;
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
    }),
  );
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

  // Seed RECIPES
  console.log('  Seeding recipes...');
  const recipes = [
    {
      name: "Classic Margherita Pizza",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
      ingredients: "Dough, Tomato Sauce, Mozzarella, Basil",
      steps: "1. Roll dough. 2. Add sauce and cheese. 3. Bake at 450F for 15 mins. 4. Garnish with basil.",
      tags: ["Italian", "Dinner", "Vegetarian"],
      dietaryRestrictions: ["Vegetarian"],
      owner: "john@foo.com", // Assigned to proper user
    },
    {
      name: "The Grinch",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c75b?auto=format&fit=crop&w=800&q=80",
      ingredients: "Green Eggs, Ham",
      steps: "1. Dye eggs green. 2. Fry ham.",
      tags: ["Holiday", "Breakfast"],
      dietaryRestrictions: [],
      owner: "john@foo.com",
    },
    {
      name: "Avocado Toast with Egg",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c75b?auto=format&fit=crop&w=800&q=80",
      ingredients: "Bread, Avocado, Egg, Chili Flakes",
      steps: "1. Toast bread. 2. Mash avocado. 3. Fry egg. 4. Assemble.",
      tags: ["Breakfast", "Healthy", "Quick"],
      dietaryRestrictions: ["Vegetarian"],
      owner: "john@foo.com",
    }
  ];

  for (const r of recipes) {
    const user = await prisma.user.findUnique({ where: { email: r.owner } });
    if (!user) continue;

    // Use name as unique identifier for upsert, or just create if cleaning DB
    // Since Recipe doesn't have unique name, allow duplicates or check first.
    // For seeding, it's safer to findFirst.
    const existing = await prisma.recipe.findFirst({ where: { name: r.name, owner: r.owner } });
    if (!existing) {
      console.log(`  Creating recipe: ${r.name}`);
      await prisma.recipe.create({
        data: {
          name: r.name,
          image: r.image,
          ingredients: r.ingredients,
          steps: r.steps,
          tags: r.tags,
          dietaryRestrictions: r.dietaryRestrictions,
          owner: r.owner,
        }
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
