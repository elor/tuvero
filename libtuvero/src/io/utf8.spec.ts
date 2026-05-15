import { expect } from "chai";
import { range } from "lodash";

import utf8 from "./utf8";

function code_to_utf8(code: number): number[] {
  const buffer = [];

  if (code <= 0x7f) {
    buffer[0] = code;
  } else if (code <= 0x7ff) {
    buffer[0] = 0xc0 | (code >> 6); /* 110xxxxx */
    buffer[1] = 0x80 | (code & 0x3f); /* 10xxxxxx */
  } else if (code <= 0xffff) {
    buffer[0] = 0xe0 | (code >> 12); /* 1110xxxx */
    buffer[1] = 0x80 | ((code >> 6) & 0x3f); /* 10xxxxxx */
    buffer[2] = 0x80 | (code & 0x3f); /* 10xxxxxx */
  } else if (code <= 0x10ffff) {
    buffer[0] = 0xf0 | (code >> 18); /* 11110xxx */
    buffer[1] = 0x80 | ((code >> 12) & 0x3f); /* 10xxxxxx */
    buffer[2] = 0x80 | ((code >> 6) & 0x3f); /* 10xxxxxx */
    buffer[3] = 0x80 | (code & 0x3f); /* 10xxxxxx */
  }
  return buffer;
}

describe("io/unicode.ts", () => {
  it("preserves empty and whitespace strings", () => {
    expect(utf8.latin2utf8("")).to.equal("");
    expect(utf8.latin2utf8("  \t ")).to.equal("  \t ");
    expect(utf8.latin2utf8("  \r\n\t\r\n ")).to.equal("  \r\n\t\r\n ");
  });

  it("preserves ascii strings", () => {
    const ascii_chars = range(32, 127)
      .map(dec => String.fromCharCode(dec))
      .join("\t");

    expect(utf8.latin2utf8(ascii_chars)).to.equal(ascii_chars);
  });

  it("preserves native javascript code points", () => {
    const umlauts = "öäüÖÄÜß";
    expect(utf8.latin2utf8(umlauts)).to.equal(umlauts);
  });

  it("converts pure utf-8", () => {
    expect(utf8.latin2utf8("Ã¤Ã¶Ã¼ÃÃÃÃ")).to.equal("äöüÄÖÜß");
  });

  it("converts mixed utf-8", () => {
    expect(utf8.latin2utf8("ÃtheriÃ¶l FuÃlÃ¤ufig BÃ¶ttcher")).to.equal(
      "Ätheriöl Fußläufig Böttcher"
    );
  });

  it("converts multibyte utf-8 points", () => {
    [0x10ffff, 0xffff, 0x7ff, 0x7f].forEach(point => {
      [1, 2, 3].forEach(divisor => {
        const ascii = code_to_utf8(point / divisor)
          .map(num => String.fromCharCode(num))
          .join("");
        const unicode = String.fromCharCode(point / divisor);

        expect(utf8.latin2utf8(ascii)).to.equal(unicode);
      });
    });
  });
});
