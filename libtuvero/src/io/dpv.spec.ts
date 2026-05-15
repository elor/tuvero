import { expect } from "chai";

import dpv from "./dpv";

const excel_exported_dpv_masters = `Teamnummer;Name1;Vorname1;LizNr1;SpielerID1;Verein1;Name2;Vorname2;LizNr2;SpielerID2;Verein2;Name3;Vorname3;LizNr3;SpielerID3;Verein3;Pseudonym;RLpunkteTeam;Setzposition;Gesetzt;Anmeldender Verein
1;Schorr;Thomas;10-001-150;0;BC Saarlouis;Kempf;Andreas;10-001-199;0;BC Saarlouis;Schwander;Thomas ;10-001-198;0;BC Saarlouis;;0;;Nein;
;;;;;;;;;;;;;;;;;;;;`;
const excel_verbose_dpv_masters = `Turniereinschreibungen Stand: 06.04.2018 - DPV-Masters Edingen-Neckarhausen,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
Teamnummer,Name1,Vorname1,LizNr1,SpielerID1,Verein1,Name2,Vorname2,LizNr2,SpielerID2,Verein2,Name3,Vorname3,LizNr3,SpielerID3,Verein3,Pseudonym,RLpunkteTeam,Setzposition,Gesetzt,Anmeldender Verein
1,Schorr,Thomas,10-001-150,0,BC Saarlouis,Kempf,Andreas,10-001-199,0,BC Saarlouis,Schwander,Thomas ,10-001-198,0,BC Saarlouis,,0,,Nein,
,,,,,,,,,,,,,,,,,,,,`;
const decoded_dpv_masters = [
  {
    "Anmeldender Verein": "",
    Gesetzt: "Nein",
    Pseudonym: "",
    RLpunkteTeam: "0",
    Setzposition: "",
    Spieler: [
      {
        importID: 1,
        Name: "Schorr",
        Vorname: "Thomas",
        LizNr: "10-001-150",
        SpielerID: "0",
        Verein: "BC Saarlouis"
      },
      {
        importID: 2,
        Name: "Kempf",
        Vorname: "Andreas",
        LizNr: "10-001-199",
        SpielerID: "0",
        Verein: "BC Saarlouis"
      },
      {
        importID: 3,
        Name: "Schwander",
        Vorname: "Thomas",
        LizNr: "10-001-198",
        SpielerID: "0",
        Verein: "BC Saarlouis"
      }
    ],
    Teamnummer: "1"
  }
];
const excel_tournament_name =
  "Turniereinschreibungen Stand: 06.04.2018 - DPV-Masters Edingen-Neckarhausen";

const one_player_teams_csv = `Teamnummer;Name1;Vorname1;LizNr1;SpielerID1;Verein1;Pseudonym;RLpunkteTeam;Setzposition;Gesetzt;Anmeldender Verein
1;Schorr;Thomas;10-001-150;0;BC Saarlouis;;0;;Nein;
2;Schwander;Thomas;10-001-198;0;BC Saarlouis;;0;;Nein;
;;;;;;;;;;;;;;;;;;;;`;
const one_player_teams_data = [
  {
    "Anmeldender Verein": "",
    Gesetzt: "Nein",
    Pseudonym: "",
    RLpunkteTeam: "0",
    Setzposition: "",
    Spieler: [
      {
        importID: 1,
        Name: "Schorr",
        Vorname: "Thomas",
        LizNr: "10-001-150",
        SpielerID: "0",
        Verein: "BC Saarlouis"
      }
    ],
    Teamnummer: "1"
  },
  {
    "Anmeldender Verein": "",
    Gesetzt: "Nein",
    Pseudonym: "",
    RLpunkteTeam: "0",
    Setzposition: "",
    Spieler: [
      {
        importID: 1,
        Name: "Schwander",
        Vorname: "Thomas",
        LizNr: "10-001-198",
        SpielerID: "0",
        Verein: "BC Saarlouis"
      }
    ],
    Teamnummer: "2"
  }
];

const partial_csv = `Teamnummer;Pseudonym
1;Tuvero
2;Pyxidea`;
const partial_data = [
  {
    "Anmeldender Verein": "",
    Gesetzt: "",
    Pseudonym: "Tuvero",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [],
    Teamnummer: "1"
  },
  {
    "Anmeldender Verein": "",
    Gesetzt: "",
    Pseudonym: "Pyxidea",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [],
    Teamnummer: "2"
  }
];

const ignored_fields_csv = `Teamnummer;Ignored
5;Blablabla
;Ignored for missing important fields`;

const ignored_data = [
  {
    "Anmeldender Verein": "",
    Gesetzt: "",
    Pseudonym: "",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [],
    Teamnummer: "5"
  }
];

const player_defaults_1_csv = `Vorname1;Name3
Erik;Arndt

Josi;Lorenz`;

const player_defaults_1_data = [
  {
    "Anmeldender Verein": "",
    Gesetzt: "",
    Pseudonym: "",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [
      {
        LizNr: "",
        Name: "",
        SpielerID: "",
        Verein: "",
        Vorname: "Erik",
        importID: 1
      },
      {
        LizNr: "",
        Name: "Arndt",
        SpielerID: "",
        Verein: "",
        Vorname: "",
        importID: 3
      }
    ],
    Teamnummer: ""
  },
  {
    "Anmeldender Verein": "",
    Gesetzt: "",
    Pseudonym: "",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [
      {
        LizNr: "",
        Name: "",
        SpielerID: "",
        Verein: "",
        Vorname: "Josi",
        importID: 1
      },
      {
        LizNr: "",
        Name: "Lorenz",
        SpielerID: "",
        Verein: "",
        Vorname: "",
        importID: 3
      }
    ],
    Teamnummer: ""
  }
];

const player_defaults_2_csv = `LizNr1
10-100-123`;

const player_defaults_2_data = [
  {
    "Anmeldender Verein": "",
    Gesetzt: "",
    Pseudonym: "",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [
      {
        LizNr: "10-100-123",
        Name: "",
        SpielerID: "",
        Verein: "",
        Vorname: "",
        importID: 1
      }
    ],
    Teamnummer: ""
  }
];

const shotgun_lines = `Teamnummer;Anmeldender Verein
1
2;1.CPC
3;LPC;Tuvero`;

const shotgun_data = [
  {
    "Anmeldender Verein": "",
    Gesetzt: "",
    Pseudonym: "",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [],
    Teamnummer: "1"
  },
  {
    "Anmeldender Verein": "1.CPC",
    Gesetzt: "",
    Pseudonym: "",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [],
    Teamnummer: "2"
  },
  {
    "Anmeldender Verein": "LPC",
    Gesetzt: "",
    Pseudonym: "",
    RLpunkteTeam: "",
    Setzposition: "",
    Spieler: [],
    Teamnummer: "3"
  }
];

describe("io/dpv.ts", () => {
  describe("import.csv()", () => {
    it("imports empty files", () => {
      expect(dpv.import.csv("")).to.deep.equal([]);
      expect(dpv.import.csv("\n\n\n")).to.deep.equal([]);
    });

    it("imports partial csv", () => {
      expect(dpv.import.csv(partial_csv)).to.deep.equal(partial_data);
    });

    it("ignores extra fields", () => {
      expect(dpv.import.csv(ignored_fields_csv)).to.deep.equal(ignored_data);
    });

    it("has empty strings as player defaults", () => {
      expect(dpv.import.csv(player_defaults_1_csv)).to.deep.equal(
        player_defaults_1_data
      );
      expect(dpv.import.csv(player_defaults_2_csv)).to.deep.equal(
        player_defaults_2_data
      );
    });

    it("imports Reference CSV", () => {
      expect(dpv.import.csv(excel_exported_dpv_masters)).to.deep.equal(
        decoded_dpv_masters
      );
      expect(dpv.import.csv(excel_verbose_dpv_masters)).to.deep.equal(
        decoded_dpv_masters
      );
      expect(dpv.import.csv(one_player_teams_csv)).to.deep.equal(
        one_player_teams_data
      );
    });

    it("imports CSV tournament name", () => {
      expect(
        dpv.import.csv_tournament_name(excel_verbose_dpv_masters)
      ).to.equal(excel_tournament_name);

      expect(dpv.import.csv_tournament_name(excel_exported_dpv_masters)).to.be
        .undefined;
    });

    it("handles varying line lengths gracefully", () => {
      expect(dpv.import.csv(shotgun_lines)).to.deep.equal(shotgun_data);
    });
  });
});
