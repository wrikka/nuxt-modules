import { db } from "~~/server/db";
import { categories } from "~~/server/db/schemas";
export async function seedCategories() {
  const sampleCategories = [
    {
      id: "1",
      name: "\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E2D\u0E19\u0E34\u0E01\u0E2A\u0E4C",
      description: "\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E2D\u0E19\u0E34\u0E01\u0E2A\u0E4C\u0E41\u0E25\u0E30\u0E41\u0E01\u0E47\u0E14\u0E40\u0E08\u0E47\u0E15\u0E15\u0E48\u0E32\u0E07\u0E46",
      parentId: null,
      image: "https://picsum.photos/seed/electronics/200/200.jpg",
      isActive: true
    },
    {
      id: "5",
      name: "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1C\u0E49\u0E32",
      description: "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1C\u0E49\u0E32\u0E41\u0E25\u0E30\u0E41\u0E1F\u0E0A\u0E31\u0E48\u0E19",
      parentId: null,
      image: "https://picsum.photos/seed/clothing/200/200.jpg",
      isActive: true
    },
    {
      id: "6",
      name: "\u0E1A\u0E49\u0E32\u0E19\u0E41\u0E25\u0E30\u0E2A\u0E27\u0E19",
      description: "\u0E40\u0E1F\u0E2D\u0E23\u0E4C\u0E19\u0E34\u0E40\u0E08\u0E2D\u0E23\u0E4C\u0E41\u0E25\u0E30\u0E02\u0E2D\u0E07\u0E15\u0E01\u0E41\u0E15\u0E48\u0E07\u0E1A\u0E49\u0E32\u0E19",
      parentId: null,
      image: "https://picsum.photos/seed/home/200/200.jpg",
      isActive: false
    },
    {
      id: "2",
      name: "\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C",
      description: "\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E41\u0E25\u0E30\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E15\u0E48\u0E2D\u0E1E\u0E48\u0E27\u0E07",
      parentId: "1",
      image: "https://picsum.photos/seed/computers/200/200.jpg",
      isActive: true
    },
    {
      id: "4",
      name: "\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D",
      description: "\u0E2A\u0E21\u0E32\u0E23\u0E4C\u0E17\u0E42\u0E1F\u0E19\u0E41\u0E25\u0E30\u0E41\u0E17\u0E47\u0E1A\u0E40\u0E25\u0E47\u0E15",
      parentId: "1",
      image: "https://picsum.photos/seed/mobile/200/200.jpg",
      isActive: true
    },
    {
      id: "3",
      name: "\u0E42\u0E19\u0E49\u0E15\u0E1A\u0E38\u0E4A\u0E04",
      description: "\u0E42\u0E19\u0E49\u0E15\u0E1A\u0E38\u0E4A\u0E04\u0E41\u0E25\u0E30\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E40\u0E2A\u0E23\u0E34\u0E21",
      parentId: "2",
      image: "https://picsum.photos/seed/laptops/200/200.jpg",
      isActive: true
    }
  ];
  for (const category of sampleCategories) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }
  console.log("\u2713 Categories seeded successfully");
}
