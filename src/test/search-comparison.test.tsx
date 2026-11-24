import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Business, Hero, SearchComparison } from "@/components/microsite/Sections";

function Experience() {
  const [active, setActive] = useState(0);
  return (
    <>
      <Hero setActive={setActive} />
      <SearchComparison active={active} setActive={setActive} />
    </>
  );
}

const pairs = [
  ["Catnapper", "catnapper.png", "catnapper ACS.png"],
  ["Green Kids Room", "Green Kids Room.png", "green kids room ACS.png"],
  ["Scandy Style Furniture", "scandy style furniture.png", "scandy style furniture ASC.png"],
  [
    "Cheap Blue Couch for College Dorm",
    "cheap blue couch for college dorm.png",
    "cheap blue couch for college dorm ACS.png",
  ],
];

describe("Ashley search comparison", () => {
  it.each(pairs)(
    "pairs both captured files for %s and zooms each original",
    (query, ashley, living) => {
      render(<Experience />);
      const tab = screen.getByRole("button", { name: `“${query}”` });
      fireEvent.click(tab);
      expect(tab).toHaveAttribute("aria-pressed", "true");

      for (const [retailer, filename] of [
        ["Ashley Furniture", ashley],
        ["Living Spaces", living],
      ]) {
        const zoom = screen.getByRole("button", { name: new RegExp(`Enlarge ${retailer}`) });
        const src = `/images/ashley/search/${encodeURIComponent(filename!)}`;
        expect(within(zoom).getByRole("img")).toHaveAttribute("src", src);
        zoom.focus();
        fireEvent.click(zoom);
        const dialog = screen.getByRole("dialog");
        expect(within(dialog).getByRole("img")).toHaveAttribute("src", src);
        expect(within(dialog).getByRole("button")).toHaveFocus();
        fireEvent.keyDown(window, { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(zoom).toHaveFocus();
      }
    },
  );

  it("opens the corresponding comparison from the hero", () => {
    const { container } = render(<Experience />);
    const comparison = container.querySelector<HTMLElement>("#today")!;
    comparison.scrollIntoView = vi.fn();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Green Kids Room" } });
    expect(comparison.scrollIntoView).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "“Green Kids Room”" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("qualifies both Ashley scenarios separately from reported customer outcomes", () => {
    render(<Business />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(6);
    for (const card of cards) {
      const illustrative = /\+(7|5)%/.test(card.textContent ?? "");
      expect(
        within(card).getByText(
          illustrative ? "Illustrative Ashley scenario" : "Reported customer outcome",
        ),
      ).toBeVisible();
    }
  });
});
