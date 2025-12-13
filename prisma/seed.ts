import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const passwordHash = await hash('changeme', 10);
  await Promise.all(
    config.defaultAccounts.map(async (account) => {
      const role = (account.role as Role) || Role.USER;
      console.log(`  Creating user: ${account.email} with role: ${role}`);
      await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name ?? undefined,
        image: account.image ?? undefined,
        dietaryRestrictions: account.dietaryRestrictions ?? [],
      },
      create: {
        email: account.email,
        password: passwordHash, // <- hashed password
        role,
        name: account.name ?? "",
        image: account.image ?? "",
        dietaryRestrictions: account.dietaryRestrictions ?? [],
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
    },
    {
    name: "Cheesy Ramen Noodles",
    image: "https://www.allrecipes.com/thmb/PNZBfGK4Ed1fGu6uXG0pDHFo-9I=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format/webp/139184-cheesy-ramen-noodles-4x3-0618-8d35bb9ffe384a5b8408240cad9cd434.jpg",
    ingredients: "2 cups water, 1 (3 ounces) package any flavor ramen noodles, 1 slice American cheese",
    steps: `1. Gather all ingredients.
2. Bring water to a boil in a saucepan. Add ramen noodles and cook until tender, about 2 minutes.
3. Pour out water, then stir in seasoning packet and cheese until well blended.`,
    tags: ["Quick", "Comfort Food"],
    dietaryRestrictions: ["vegetarian"],
    owner: "emma43@hawaii.edu"
  },
  {
    name: "Brown Sugar Ramen",
    image: "",
    ingredients: "Water, Noodles, 1/4 cup Brown sugar, Shoyu, Furikake, Butter, Sesame seeds, Egg",
    steps: `1. Boil water.
2. Put noodles in boiled water.
3. Separate noodles from noodle juice, putting both aside.
4. Put a pan on low heat and add butter, brown sugar, shoyu, furikake, sesame seeds.
5. Stir in noodles and noodle juice.
6. Fry egg softly and mix in.
7. Serve and sprinkle sesame seeds.`,
    tags: ["Savory", "Fusion"],
    dietaryRestrictions: ["nut-free", "dairy-free"],
    owner: "kai.nakamura@hawaii.edu"
  },
  {
    name: "Overnight Oats",
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/7/21/1/HE_Overnight-Oats-2_s4x3.jpg.rend.hgtvcom.826.620.suffix/1437508212948.webp",
    ingredients: "1/3 to 1/2 cup liquid (milk, almond, cashew, or coconut), 1/3 to 1/2 cup old-fashioned rolled oats, 1/3 to 1/2 cup yogurt (optional), 1 tsp chia seeds (optional), 1/2 banana, mashed (optional), Toppings: fruit, nuts, nut butter, seeds, protein powder, granola, coconut, spices, citrus zest, vanilla extract",
    steps: `1. Add milk, oats, yogurt, chia seeds, and banana to a jar or container. Stir well.
2. Refrigerate overnight or for at least 5 hours.
3. In the morning, add additional liquid if needed and top with desired toppings.`,
    tags: ["Breakfast", "Healthy"],
    dietaryRestrictions: [],
    owner: "emma43@hawaii.edu"
  },
  {
    name: "Rice Cooker Pancake",
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2021/10/11/0/FNK_Rice-Cooker-Pancakes_H1_s4x3.jpg.rend.hgtvcom.826.620.suffix/1633966864826.webp",
    ingredients: "Nonstick cooking spray, 1 1/2 cups all-purpose flour, 3 tbsp sugar, 1 tbsp baking powder, 1/2 tsp kosher salt, 2 large eggs, room temperature, 1 1/4 cups milk, room temperature, 3 tbsp unsalted butter, melted, 1/2 tsp pure vanilla extract, Maple syrup, for serving",
    steps: `1. Lightly coat the inner pot of a 10-cup rice cooker with nonstick spray.
2. Whisk flour, sugar, baking powder, and salt in a large bowl.
3. Whisk eggs, milk, butter, and vanilla in a medium bowl.
4. Combine wet and dry ingredients.
5. Pour batter into rice cooker and cook on standard cycle (35–50 mins).
6. Invert onto a plate and serve with butter and syrup.`,
    tags: ["Breakfast", "Easy"],
    dietaryRestrictions: [],
    owner: "miasantos@hawaii.edu"
  },
  {
    name: "Microwave Mac and Cheese",
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/4/3/1/FNK_Microwave-Mac-and-Cheese_s4x3.jpg.rend.hgtvcom.826.620.suffix/1396879977387.webp",
    ingredients: "1 1/2 cups elbow macaroni, 2 cups whole milk, Kosher salt, 1 cup shredded American cheese, 1 cup shredded pepper jack or Monterey Jack cheese, 1/4 cup grated Parmesan, 2 ounces cream cheese, 1 tsp Dijon mustard",
    steps: `1. Stir macaroni, 1 cup milk, and salt in a microwave-safe bowl.
2. Cover and microwave 4 minutes.
3. Stir and add remaining milk, cheeses, and mustard.
4. Microwave in increments of 30 seconds until cheese melts and macaroni is cooked.`,
    tags: ["Quick", "Comfort Food"],
    dietaryRestrictions: ["vegan", "gluten-free"],
    owner: "noah.kim57@hawaii.edu"
  }
  ];

  for (const r of recipes) {
  // Ensure the owner exists
  const user = await prisma.user.findUnique({ where: { email: r.owner } });
  if (!user) {
    console.log(`  ⚠ Skipping recipe "${r.name}" because owner "${r.owner}" not found`);
    continue;
  }

  // Check if recipe already exists
  const existing = await prisma.recipe.findFirst({
    where: { name: r.name, owner: r.owner },
  });

  if (existing) {
    console.log(`  Updating recipe: ${r.name}`);
    await prisma.recipe.update({
      where: { id: existing.id },
      data: {
        image: r.image,
        ingredients: r.ingredients,
        steps: r.steps,
        tags: r.tags,
        dietaryRestrictions: r.dietaryRestrictions,
      },
    });
  } else {
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
