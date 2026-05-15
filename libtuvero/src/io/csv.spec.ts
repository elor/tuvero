import { expect } from "chai";

import csv from "./csv";

const excel_exported_dpv_masters = `Teamnummer;Name1;Vorname1;LizNr1;SpielerID1;Verein1;Name2;Vorname2;LizNr2;SpielerID2;Verein2;Name3;Vorname3;LizNr3;SpielerID3;Verein3;Pseudonym;RLpunkteTeam;Setzposition;Gesetzt;Anmeldender Verein
1;Schorr;Thomas;10-001-150;0;BC Saarlouis;Kempf;Andreas;10-001-199;0;BC Saarlouis;Schwander;Thomas ;10-001-198;0;BC Saarlouis;;0;;Nein;
;;;;;;;;;;;;;;;;;;;;`;
const decoded_dpv_masters = [
  [
    "Teamnummer",
    "Name1",
    "Vorname1",
    "LizNr1",
    "SpielerID1",
    "Verein1",
    "Name2",
    "Vorname2",
    "LizNr2",
    "SpielerID2",
    "Verein2",
    "Name3",
    "Vorname3",
    "LizNr3",
    "SpielerID3",
    "Verein3",
    "Pseudonym",
    "RLpunkteTeam",
    "Setzposition",
    "Gesetzt",
    "Anmeldender Verein"
  ],
  [
    "1",
    "Schorr",
    "Thomas",
    "10-001-150",
    "0",
    "BC Saarlouis",
    "Kempf",
    "Andreas",
    "10-001-199",
    "0",
    "BC Saarlouis",
    "Schwander",
    "Thomas",
    "10-001-198",
    "0",
    "BC Saarlouis",
    "",
    "0",
    "",
    "Nein",
    ""
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ]
];

describe("io/csv.ts", () => {
  describe("read()", () => {
    it("is empty for read('')", () => {
      expect(csv.read("")).to.have.length(0);
    });

    it("extracts unescaped CSV fields", () => {
      expect(csv.read("  It, extracts, 4,Fields!  ")).to.deep.equal([
        ["It", "extracts", "4", "Fields!"]
      ]);

      expect(csv.read("  It; extracts; 4;Fields!  ")).to.deep.equal([
        ["It", "extracts", "4", "Fields!"]
      ]);
    });

    it("reads empty field sequences", () => {
      expect(csv.read(",")).to.deep.equal([["", ""]]);
      expect(csv.read(",,")).to.deep.equal([["", "", ""]]);
      expect(csv.read(",,,,")).to.deep.equal([["", "", "", "", ""]]);

      expect(csv.read(";")).to.deep.equal([["", ""]]);
      expect(csv.read(";;")).to.deep.equal([["", "", ""]]);
      expect(csv.read(";;;;")).to.deep.equal([["", "", "", "", ""]]);

      expect(csv.read(",;,;")).to.deep.equal([["", "", "", "", ""]]);
    });

    it("parses multiple lines", () => {
      expect(csv.read("Firstline\nSecondline")).to.deep.equal([
        ["Firstline"],
        ["Secondline"]
      ]);

      expect(csv.read("1, A\r\n2;B")).to.deep.equal([["1", "A"], ["2", "B"]]);
    });

    it("ignores empty lines", () => {
      expect(csv.read("\r\n1, A\r\n\r\n2;B")).to.deep.equal([
        ["1", "A"],
        ["2", "B"]
      ]);
    });

    it("parses escaped fields", () => {
      expect(
        csv.read(
          `unescaped, "escaped field", "escaped, field, with, commas", trailing_unescaped`
        )
      ).to.deep.equal([
        [
          "unescaped",
          "escaped field",
          "escaped, field, with, commas",
          "trailing_unescaped"
        ]
      ]);

      expect(
        csv.read(
          `unescaped; "escaped field"; "escaped, field, with, commas"; trailing_unescaped`
        )
      ).to.deep.equal([
        [
          "unescaped",
          "escaped field",
          "escaped, field, with, commas",
          "trailing_unescaped"
        ]
      ]);
    });

    it("parses unescaped spaced fields (nonstandard)", () => {
      expect(csv.read("unescaped, unescaped with spaces")).to.deep.equal([
        ["unescaped", "unescaped with spaces"]
      ]);

      expect(csv.read("unescaped; unescaped with spaces")).to.deep.equal([
        ["unescaped", "unescaped with spaces"]
      ]);
    });

    it("imports Excel-exported CSV", () => {
      expect(csv.read(excel_exported_dpv_masters)).to.deep.equal(
        decoded_dpv_masters
      );
    });
  });
});
