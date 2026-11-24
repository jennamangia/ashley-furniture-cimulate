import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShopperAgent } from "@/components/microsite/ShopperAgent";

describe("Illustrative furniture Shopper Agent", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function mockViewport() {
    let report: IntersectionObserverCallback;
    const observer = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (callback: IntersectionObserverCallback) {
        report = callback;
        return observer;
      }),
    );

    return (ratio: number) =>
      act(() =>
        report(
          [{ isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry],
          observer as unknown as IntersectionObserver,
        ),
      );
  }

  function advance() {
    act(() => vi.advanceTimersToNextTimer());
  }

  it("starts after one second at half visibility and suspends playback when out of view", () => {
    const report = mockViewport();
    render(<ShopperAgent />);
    const history = within(screen.getByRole("log"));

    report(0.49);
    act(() => vi.advanceTimersByTime(2000));
    expect(
      history.queryByText(
        "I’m looking at this sofa, but I’m not sure it’ll work in my living room.",
      ),
    ).toBeNull();

    report(0.5);
    act(() => vi.advanceTimersByTime(900));
    expect(
      history.queryByText(
        "I’m looking at this sofa, but I’m not sure it’ll work in my living room.",
      ),
    ).toBeNull();
    report(0);
    act(() => vi.advanceTimersByTime(2000));
    expect(
      history.queryByText(
        "I’m looking at this sofa, but I’m not sure it’ll work in my living room.",
      ),
    ).toBeNull();

    report(0.5);
    act(() => vi.advanceTimersByTime(1000));
    expect(
      history.getByText("I’m looking at this sofa, but I’m not sure it’ll work in my living room."),
    ).toBeVisible();
    act(() => vi.advanceTimersByTime(800));
    report(0);
    act(() => vi.advanceTimersByTime(10000));
    expect(history.queryByText(/Do you know roughly/)).toBeNull();
    report(0.5);
    act(() => vi.advanceTimersByTime(999));
    expect(history.queryByText(/Do you know roughly/)).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(history.getByText(/Do you know roughly/)).toBeVisible();
    expect(
      history.getAllByText(
        "I’m looking at this sofa, but I’m not sure it’ll work in my living room.",
      ),
    ).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Pause conversation" }));
    report(0);
    report(0.5);
    act(() => vi.advanceTimersByTime(30000));
    expect(history.queryByText(/smaller apartment/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Resume conversation" }));
    advance();
    expect(history.getByText(/smaller apartment/)).toBeVisible();

    for (let n = 0; n < 6; n++) advance();
    report(0);
    report(0.5);
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("button", { name: "Replay conversation" })).toBeVisible();
    expect(history.getByText(/A compact coffee table/)).toBeVisible();
  });

  it("leaves playback manual for visitors who prefer reduced motion", () => {
    const report = mockViewport();
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    vi.spyOn(window, "matchMedia").mockReturnValue({ ...mediaQuery, matches: true });
    render(<ShopperAgent />);
    report(0.75);
    act(() => vi.advanceTimersByTime(5000));
    expect(
      screen.queryByText(
        "I’m looking at this sofa, but I’m not sure it’ll work in my living room.",
      ),
    ).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Play conversation" }));
    advance();
    expect(
      screen.getByText("I’m looking at this sofa, but I’m not sure it’ll work in my living room."),
    ).toBeVisible();
  });

  it("plays messages sequentially, pauses when closed and resumes the same transcript", () => {
    render(<ShopperAgent />);
    fireEvent.click(screen.getByRole("button", { name: "Play conversation" }));
    advance();
    const history = screen.getByRole("log");
    expect(
      within(history).getByText(
        "I’m looking at this sofa, but I’m not sure it’ll work in my living room.",
      ),
    ).toBeVisible();
    expect(within(history).queryByText(/Do you know roughly/)).toBeNull();
    advance();
    expect(within(history).getByText(/Do you know roughly/)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Close Shopper Agent" }));
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.queryByRole("log")).toBeNull();
    expect(screen.getByRole("img", { name: /Altari Sofa/ })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Ask about this sofa" }));
    expect(screen.getByRole("log")).toBe(history);
    expect(within(history).queryByText(/smaller apartment/)).toBeNull();
    act(() => vi.advanceTimersByTime(5500));
    expect(within(history).getByText(/smaller apartment/)).toBeVisible();
    expect(
      within(history).getByText(
        "I’m looking at this sofa, but I’m not sure it’ll work in my living room.",
      ),
    ).toBeVisible();
  });

  it("shows product cards in the transcript and starts over on Replay", () => {
    render(<ShopperAgent />);
    fireEvent.click(screen.getByRole("button", { name: "Play conversation" }));
    const history = within(screen.getByRole("log"));
    for (let n = 0; n < 5; n++) advance();
    expect(history.getByText("Do you have anything similar that might work better?")).toBeVisible();
    expect(history.queryByRole("list")).toBeNull();
    advance();

    const recommendations = history.getByRole("list", { name: "Explore sofas and loveseats" });
    const links = within(recommendations).getAllByRole("link");
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link).toHaveAttribute("href", expect.stringContaining("www.ashleyfurniture.com/p/"));
      expect(link.querySelector("img")).toHaveAttribute(
        "src",
        expect.stringContaining("/images/ashley/"),
      );
    }
    expect(history.getByRole("button", { name: "Previous product" })).toBeDisabled();
    expect(history.getByRole("button", { name: "Next product" })).toBeEnabled();

    for (let n = 0; n < 3; n++) advance();
    expect(history.getByText(/A compact coffee table/)).toBeVisible();
    expect(
      history.getByText("I’m looking at this sofa, but I’m not sure it’ll work in my living room."),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Replay conversation" }));
    expect(history.queryByRole("list")).toBeNull();
    expect(history.queryByText(/A compact coffee table/)).toBeNull();
    advance();
    expect(
      history.getByText("I’m looking at this sofa, but I’m not sure it’ll work in my living room."),
    ).toBeVisible();
  });

  it("enlarges the Ashley product image and closes on Escape", () => {
    render(<ShopperAgent />);
    fireEvent.click(screen.getByRole("button", { name: "Enlarge product image" }));
    expect(screen.getByRole("dialog", { name: "Enlarged Ashley product image" })).toBeVisible();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
