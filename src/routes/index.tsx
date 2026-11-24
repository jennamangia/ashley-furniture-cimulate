import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  SearchComparison,
  Business,
  Proof,
  Closing,
  useReveal,
} from "@/components/microsite/Sections";
import { Understanding } from "@/components/microsite/Understanding";

import { ShopperAgent } from "@/components/microsite/ShopperAgent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ashley Furniture × Agentic Commerce Search — Reimagining Discovery" },
      {
        name: "description",
        content:
          "An executive concept showing how Salesforce Agentic Commerce Search could transform product discovery for Ashley Furniture.",
      },
      { property: "og:title", content: "Ashley Furniture × Agentic Commerce Search" },
      {
        property: "og:description",
        content: "From matching words to understanding shopper intent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  const [active, setActive] = useState(0);
  return (
    <main>
      <Hero setActive={setActive} />
      <SearchComparison active={active} setActive={setActive} />
      <Understanding />
      <ShopperAgent />
      <Proof />
      <Business />
      <Closing />
    </main>
  );
}
