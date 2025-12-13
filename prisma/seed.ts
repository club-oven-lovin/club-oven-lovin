import { PrismaClient, Role } from '@prisma/client';
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
      image: "https://www.allrecipes.com/thmb/PNZBfGK4Ed1fGu6uXG0pDHFo-9I=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/139184-cheesy-ramen-noodles-4x3-0618-8d35bb9ffe384a5b8408240cad9cd434.jpg",
      ingredients: "2 cups water, 1 (3 ounces) package any flavor ramen noodles, 1 slice American cheese",
      steps: `1. Bring water to a boil in a saucepan.
2. Add ramen noodles and cook until tender, about 2 minutes.
3. Pour out water, then stir in seasoning packet and cheese until well blended.`,
      tags: ["Quick", "Comfort Food"],
      dietaryRestrictions: ["vegetarian"],
      owner: "emma43@hawaii.edu"
    },
    {
      name: "Brown Sugar Ramen",
      image: "https://www.recipe-diaries.com/wp-content/uploads/2024/07/tiktokramen.jpg",
      ingredients: "Water, Noodles, 1/4 cup Brown sugar, Shoyu, Furikake, Butter, Sesame seeds, Egg",
      steps: `1. Boil water.
2. Put noodles in boiled water.
3. Separate noodles from noodle juice, putting both aside.
4. Put a pan on low heat and add butter, brown sugar, shoyu, furikake, sesame seeds.
5. Stir in noodles.
6. Put on the side and softly fry egg.
7. Stir in pasta water.
8. Serve and sprinkle sesame seeds.`,
      tags: ["Savory", "Fusion"],
      dietaryRestrictions: ["nut-free", "dairy-free"],
      owner: "kai.nakamura@hawaii.edu"
    },
    {
      name: "Overnight Oats",
      image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/7/21/1/HE_Overnight-Oats-2_s4x3.jpg.rend.hgtvcom.826.620.suffix/1437508212948.webp",
      ingredients: "1/3 to 1/2 cup milk, 1/3 to 1/2 cup old-fashioned rolled oats, 1/3 to 1/2 cup yogurt (optional), 1 tsp chia seeds (optional), 1/2 mashed banana (optional), desired toppings",
      steps: `1. Add milk, oats, yogurt, chia seeds, and banana to a jar or container. Stir well.
2. Refrigerate overnight or for at least 5 hours.
3. In the morning, add additional liquid if needed and top with desired toppings.
Note: The mixture will keep for up to 2 days. If you don't add the banana, up to 4 days.`,
      tags: ["Breakfast", "Healthy"],
      dietaryRestrictions: [],
      owner: "emma43@hawaii.edu"
    },
    {
      name: "Rice Cooker Pancake",
      image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2021/10/11/0/FNK_Rice-Cooker-Pancakes_H1_s4x3.jpg.rend.hgtvcom.826.620.suffix/1633966864826.webp",
      ingredients: "Nonstick cooking spray, 1 1/2 cups all-purpose flour, 3 tbsp sugar, 1 tbsp baking powder, 1/2 tsp kosher salt, 2 large eggs (at room temperature), 1 1/4 cups milk (at room temperature), 3 tbsp unsalted butter that's melted and cooled, 1/2 tsp pure vanilla extract, Maple syrup for serving",
      steps: `1. Lightly coat the inner pot of a 10-cup rice cooker with nonstick spray.
2. Whisk flour, sugar, baking powder, and salt in a large bowl.
3. Whisk eggs, milk, butter, and vanilla in a medium bowl.
4. Whisk the egg mixture into the flour mixture until just combined (it's okay if there are a few lumps).
5. Pour the batter into the prepared pot, place the pot into the rice cooker and seal the lid shut. Set the rice cooker on the standard white rice cycle and cook until the underside of the pancake is golden brown, the top is firm yet bouncy to the touch and a toothpick inserted into the center comes out clean, 35 to 50 minutes.
6. Invert onto a plate and serve with butter and syrup.`,
      tags: ["Breakfast"],
      dietaryRestrictions: [],
      owner: "miasantos@hawaii.edu"
    },
    {
      name: "Microwave Mac and Cheese",
      image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/4/3/1/FNK_Microwave-Mac-and-Cheese_s4x3.jpg.rend.hgtvcom.826.620.suffix/1396879977387.webp",
      ingredients: "1 1/2 cups elbow macaroni, 2 cups whole milk, Kosher salt, 1 cup shredded American cheese, 1 cup shredded pepper jack or Monterey Jack cheese, 1/4 cup grated Parmesan, 2 ounces cream cheese, 1 tsp Dijon mustard",
      steps: `1. Stir the macaroni, 1 cup of the milk and 1/4 teaspoon salt in a microwave-safe 4-quart bowl. (It's important that you use a bowl large enough to prevent the milk from boiling over.) Cover tightly with plastic wrap; cut a small slit in the center with the tip of a paring knife to vent excess steam.
2. Microwave on high (at 100 percent power) for 4 minutes in either an 1,100- or a 700-watt oven.
3. Uncover (be careful to avoid the hot steam) and stir.
4. Cover and microwave on high (at 100 percent power) until the macaroni is about two-thirds cooked, a little harder than al dente, 1 1/2 minutes in an 1,100-watt oven or 3 1/2 minutes in a 700-watt oven.
5. Add the remaining cup of milk, American cheese, Jack cheese, Parmesan, cream cheese and mustard. 
6. Stir well, cover tightly and microwave on high (at 100 percent power) until all the cheeses have melted, 4 minutes in an 1,100-watt oven or 4 1/2 in a 700-watt oven. 
7. Stir until thoroughly combined. If there are still some pieces of unmelted cheese, microwave again, covered, in 30-second increments. (The sauce will continue to thicken as it sits.)`,
      tags: ["Quick", "Comfort Food"],
      dietaryRestrictions: ["vegetarian"],
      owner: "noah.kim57@hawaii.edu"
    },
    {
      name: "Cilantro-Avocado Tuna Salad Sandwiches",
      image: "https://www.tasteofhome.com/wp-content/uploads/2017/09/exps100790__SD153320C12_05_2b.jpg?fit=750%2C750",
      ingredients: `2 pouches (5 ounces each) albacore white tuna in water
1/3 cup mayonnaise
3 tablespoons minced fresh cilantro
2 tablespoons lime juice
2 garlic cloves (minced)
1/4 teaspoon salt
1/8 teaspoon pepper
8 slices whole wheat bread (toasted if desired)
4 slices Muenster or provolone cheese
1 medium ripe avocado (peeled and sliced)`,
      steps: `1. In a small bowl, mix the first 7 ingredients. 
2. Spread tuna mixture over 4 slices of bread; top with cheese, avocado and remaining bread. 
3. Serve immediately.`,
      tags: ["Lunch", "Sandwiches"],
      dietaryRestrictions: ["vegetarian"],
      owner: "kai.nakamura@hawaii.edu"
    },
    {
      name: "Emergency Garlic Bread",
      image: "https://www.allrecipes.com/thmb/JiI9GSmhCgXcrkIY8JrItJc8SQw=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/86545-Emergency-Garlic-Bread-DDMFS-4x3-1-62704d18a4e2450c83c661515d973812.jpg",
      ingredients: "4 hot dog buns, 4 teaspoons butter (softened), 2 teaspoons garlic powder (or to taste)",
      steps: `1. Gather all ingredients
2. Set an oven rack about 6 inches from the heat source and preheat the oven's broiler.
3. Separate buns and spread butter onto the cut side of each one.
4. Sprinkle with garlic powder. Place on a baking tray.
Toast under the preheated broiler until golden brown, about 4 minutes.`,
      tags: [],
      dietaryRestrictions: [],
      owner: "miasantos@hawaii.edu"
    },
    {
      name: "Microwave Chocolate Mug Cake",
      image: "https://www.allrecipes.com/thmb/FJem9Shp3noz-OmMmaUuZzUWll8=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/241038-Microwave-Chocolate-Mug-Cake-4x3-01-4a45acfde3dc40f3a778662ecc6f2108.jpg",
      ingredients: `1/4 cup all-purpose flour
1/4 cup white sugar
2 tablespoons unsweetened cocoa powder
1/8 teaspoon baking soda
1/8 teaspoon salt
3 tablespoons milk
2 tablespoons canola oil
1 tablespoon water
1/4 teaspoon vanilla extract`,
      steps: `1. Mix flour, sugar, cocoa powder, baking soda, and salt together in a large microwave-safe mug; stir in milk, canola oil, water, and vanilla extract.
2. Cook in the microwave until the cake is done in the middle, about 1 minute 45 seconds.`,
      tags: ["Happy Birthday", "Desserts"],
      dietaryRestrictions: ["nut-free"],
      owner: "miasantos@hawaii.edu"
    },
    {
      name: "Grilled Cheese In Toaster Oven",
      image: "https://kitchendivas.com/wp-content/uploads/2023/01/toaster-oven-grilled-cheesexx.jpg",
      ingredients: "2 Sliced bread, Cheese slices, Butter (salted butter suggested but unsalted will work too)",
      steps: `1.  Butter 1 side of 2 pieces of bread and place them butter-side down on a piece of foil that will fit in your toaster oven. Cover completely with cheese slices.
2. Toast the slices until the cheese begins to melt. Then, top both with another slice of buttered bread.
3. Continue To Toast the sandwiches until the bread is golden brown, then flip the sandwiches and toast to golden brown on the other side.
4. Cut in half and enjoy!`,
      tags: ["Quick", "Comfort Food"],
      dietaryRestrictions: [],
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
