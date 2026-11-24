const images = "/images/ashley/search";

export const account = {
  queries: [
    {
      id: "catnapper",
      query: "Catnapper",
      heading: "Understanding What Shoppers Want — Even When You Don't Carry the Brand.",
      context:
        "Catnapper is associated with recliners and reclining furniture. A shopper may want that brand or be open to comparable seating.",
      ashley: "Baby cribs appear in the captured results.",
      livingSpaces: "Recliners, gliders, and comparable seating appear in the captured results.",
      takeaway: "The shopper asked for a brand. The experience understood the product category.",
      insight:
        "Knowledge of brands and products beyond the catalog can help surface relevant alternatives.",
      files: ["catnapper.png", "catnapper ACS.png"],
    },
    {
      id: "green-kids-room",
      query: "Green Kids Room",
      heading: "Understanding the Room, Not Just the Color.",
      context:
        "This room-furnishing mission combines a color preference, a room type, and an intended user.",
      ashley: "A green pillow appears alongside brown dressers, nightstands, and shelving.",
      livingSpaces:
        "Green twin beds, bunk beds, a kids’ desk, and other green children’s furniture appear.",
      takeaway: "Three simple words. One complete shopping mission.",
      insight:
        "Connecting color, room, and intended user can bring together a more cohesive set of products.",
      files: ["Green Kids Room.png", "green kids room ACS.png"],
    },
    {
      id: "scandy",
      query: "Scandy Style Furniture",
      heading: "Understanding the Aesthetic Behind the Words.",
      context:
        "“Scandy” is an informal reference to Scandinavian-inspired design. The shopper is looking for an aesthetic across furniture categories.",
      ashley: "The results include conventional sofas, dark furniture, and patterned chairs.",
      livingSpaces:
        "Light woods, pale neutrals, clean lines, and minimalist silhouettes are visible across the results.",
      takeaway: "Shoppers don't always know the product name. They know the look they want.",
      insight:
        "Computer vision can enrich product data with attributes like finish, shape, and style, giving search more ways to connect a phrase to a look.",
      files: ["scandy style furniture.png", "scandy style furniture ASC.png"],
    },
    {
      id: "college-dorm",
      query: "Cheap Blue Couch for College Dorm",
      heading: "Understanding the Entire Request, Not Just the Product.",
      context:
        "The shopper wants a sofa, prefers blue, has a limited budget, and is furnishing a college dorm.",
      ashley: "Beige, gray, and green sofas appear alongside a blue recliner.",
      livingSpaces:
        "The results show predominantly blue sofas and loveseats, including relatively affordable options.",
      takeaway: "Product. Color. Budget. Context. All in one search.",
      insight:
        "Interpreting constraints together helps narrow the choices. Shoppers can then check dimensions and residence policies for their own space.",
      files: ["cheap blue couch for college dorm.png", "cheap blue couch for college dorm ACS.png"],
    },
  ].map(({ files, ...query }) => ({
    ...query,
    screenshot: `${images}/${encodeURIComponent(files[0]!)}`,
    livingSpacesScreenshot: `${images}/${encodeURIComponent(files[1]!)}`,
  })),
  customerExamples: [
    {
      name: "West Marine",
      query: "Cleaning supplies for the head",
      screenshot: "/images/customers/west-marine-v2.png",
      explanation:
        "In boating, the head is the bathroom aboard a vessel. The results surface marine head cleaners and holding-tank treatments.",
      takeaway: "Understands industry-specific terminology.",
    },
    {
      name: "PacSun",
      query: "Women's comfortable but not too baggy jeans",
      screenshot: "/images/customers/pacsun-v3.png",
      explanation:
        "The shopper describes a balance of comfort and shape. The results show relaxed and straight-leg women’s denim.",
      takeaway: "Understands nuanced fit preferences.",
    },
    {
      name: "Ann Taylor",
      query: "Statement earrings for dinner party",
      screenshot: "/images/customers/ann-taylor.png",
      explanation:
        "The occasion and personal style connect the shopper to expressive statement earrings.",
      takeaway: "Understands occasions and personal style.",
    },
  ],
  outcomes: [
    { value: "+7%", label: "Site Search Conversion Rate", scenario: true },
    { value: "+13%", label: "Average Order Value" },
    { value: "−96%", label: "Null Search Results" },
    { value: "−85%", label: "Merchandising Rule Reduction" },
    { value: "+33%", label: "Clicks per User" },
    { value: "+5%", label: "Potential Search RPV Lift", scenario: true },
  ],
};
