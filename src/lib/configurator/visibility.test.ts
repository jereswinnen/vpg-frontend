import { describe, it, expect } from "vitest";
import { isQuestionVisible } from "./visibility";
import type { VisibilityConfig } from "./types";

describe("isQuestionVisible", () => {
  it("returns true when rules are null", () => {
    expect(isQuestionVisible(null, {})).toBe(true);
  });

  it("returns true when rules are undefined", () => {
    expect(isQuestionVisible(undefined, {})).toBe(true);
  });

  it("returns true when rules array is empty", () => {
    const config: VisibilityConfig = { rules: [], logic: "all" };
    expect(isQuestionVisible(config, {})).toBe(true);
  });

  it("equals: matches when answer equals value", () => {
    const config: VisibilityConfig = {
      rules: [{ questionKey: "material", operator: "equals", value: "hout" }],
      logic: "all",
    };
    expect(isQuestionVisible(config, { material: "hout" })).toBe(true);
    expect(isQuestionVisible(config, { material: "metaal" })).toBe(false);
  });

  it("not_equals: matches when answer differs", () => {
    const config: VisibilityConfig = {
      rules: [{ questionKey: "material", operator: "not_equals", value: "hout" }],
      logic: "all",
    };
    expect(isQuestionVisible(config, { material: "metaal" })).toBe(true);
    expect(isQuestionVisible(config, { material: "hout" })).toBe(false);
  });

  it("includes: matches when array answer contains value", () => {
    const config: VisibilityConfig = {
      rules: [{ questionKey: "features", operator: "includes", value: "wifi" }],
      logic: "all",
    };
    expect(isQuestionVisible(config, { features: ["wifi", "bluetooth"] })).toBe(true);
    expect(isQuestionVisible(config, { features: ["bluetooth"] })).toBe(false);
  });

  it("is_empty: matches undefined, empty string, and empty array", () => {
    const config: VisibilityConfig = {
      rules: [{ questionKey: "note", operator: "is_empty" }],
      logic: "all",
    };
    expect(isQuestionVisible(config, {})).toBe(true);
    expect(isQuestionVisible(config, { note: "filled" })).toBe(false);
  });

  it("is_not_empty: matches when answer has a value", () => {
    const config: VisibilityConfig = {
      rules: [{ questionKey: "note", operator: "is_not_empty" }],
      logic: "all",
    };
    expect(isQuestionVisible(config, { note: "hello" })).toBe(true);
    expect(isQuestionVisible(config, {})).toBe(false);
  });

  it("greater_than: matches when numeric answer exceeds value", () => {
    const config: VisibilityConfig = {
      rules: [{ questionKey: "width", operator: "greater_than", value: 3 }],
      logic: "all",
    };
    expect(isQuestionVisible(config, { width: 4 })).toBe(true);
    expect(isQuestionVisible(config, { width: 2 })).toBe(false);
  });

  it("less_than: matches when numeric answer is below value", () => {
    const config: VisibilityConfig = {
      rules: [{ questionKey: "height", operator: "less_than", value: 10 }],
      logic: "all",
    };
    expect(isQuestionVisible(config, { height: 9 })).toBe(true);
    expect(isQuestionVisible(config, { height: 11 })).toBe(false);
  });

  it('logic "all": all rules must pass', () => {
    const config: VisibilityConfig = {
      rules: [
        { questionKey: "material", operator: "equals", value: "hout" },
        { questionKey: "width", operator: "greater_than", value: 2 },
      ],
      logic: "all",
    };
    expect(isQuestionVisible(config, { material: "hout", width: 3 })).toBe(true);
    expect(isQuestionVisible(config, { material: "hout", width: 1 })).toBe(false);
  });

  it('logic "any": at least one rule must pass', () => {
    const config: VisibilityConfig = {
      rules: [
        { questionKey: "material", operator: "equals", value: "hout" },
        { questionKey: "width", operator: "greater_than", value: 2 },
      ],
      logic: "any",
    };
    expect(isQuestionVisible(config, { material: "hout", width: 1 })).toBe(true);
    expect(isQuestionVisible(config, { material: "metaal", width: 1 })).toBe(false);
  });
});
