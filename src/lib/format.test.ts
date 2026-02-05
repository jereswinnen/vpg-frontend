import { describe, it, expect } from "vitest";
import { formatFileSize, formatDateShort } from "./format";

describe("formatFileSize", () => {
  it("returns '0 B' for 0 bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("formats bytes correctly", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("formats kilobytes correctly", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes correctly", () => {
    expect(formatFileSize(1048576)).toBe("1 MB");
    expect(formatFileSize(2621440)).toBe("2.5 MB");
  });

  it("formats gigabytes correctly", () => {
    expect(formatFileSize(1073741824)).toBe("1 GB");
  });
});

describe("formatDateShort", () => {
  it("formats date in Dutch Belgian format", () => {
    const result = formatDateShort("2024-03-15");
    // nl-BE format: "15 mrt 2024" or similar
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("handles ISO date strings", () => {
    const result = formatDateShort("2024-12-25T10:30:00Z");
    expect(result).toContain("25");
    expect(result).toContain("2024");
  });
});
