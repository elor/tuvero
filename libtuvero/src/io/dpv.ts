import csv from "./csv";
import { zipObject, uniq } from "lodash";

type dpv_player = {
  "importID": number;
  "Name": string;
  "Vorname": string;
  "LizNr": string;
  "SpielerID": string;
  "Verein": string;
};

type dpv_registration = {
  "Teamnummer": string;
  "Pseudonym": string;
  "RLpunkteTeam": string;
  "Setzposition": string;
  "Gesetzt": string;
  "Anmeldender Verein": string;
  "Spieler": dpv_player[];
};

function is_empty_array(array: string[]): boolean {
  return array.every(element => !element);
}

function is_empty_player(player: dpv_player): boolean {
  return (
    !player.Name &&
    !player.Vorname &&
    !player.LizNr &&
    !player.SpielerID &&
    !player.Verein
  );
}

function is_empty_team(team: dpv_registration): boolean {
  return (
    !team.Teamnummer &&
    !team.Pseudonym &&
    !team.RLpunkteTeam &&
    !team.Setzposition &&
    !team.Gesetzt &&
    !team["Anmeldender Verein"] &&
    team.Spieler.every(is_empty_player)
  );
}

function get_name_header(csv_fields: string[][]): string | undefined {
  if (
    csv_fields.length >= 2 &&
    csv_fields[0].length > 1 &&
    !!csv_fields[0][0] &&
    is_empty_array(csv_fields[0].slice(1))
  ) {
    return csv_fields[0][0];
  }
  return undefined;
}

function field_object_to_players(team: { [id: string]: string }): dpv_player[] {
  const IDs = uniq(
    Object.keys(team)
      .map(field => field.replace(/.*?(\d*)$/, "$1"))
      .filter(field => !!field)
      .map(field => Number(field))
  );

  return IDs.map(ID => ({
    importID: ID,
    Name: team[`Name${ID}`] || "",
    Vorname: team[`Vorname${ID}`] || "",
    LizNr: team[`LizNr${ID}`] || "",
    SpielerID: team[`SpielerID${ID}`] || "",
    Verein: team[`Verein${ID}`] || ""
  })).filter(player => !is_empty_player(player));
}

function field_object_to_registration(
  team: { [id: string]: string }
): dpv_registration {
  return {
    Teamnummer: team.Teamnummer || "",
    Pseudonym: team.Pseudonym || "",
    RLpunkteTeam: team.RLpunkteTeam || "",
    Setzposition: team.Setzposition || "",
    Gesetzt: team.Gesetzt || "",
    "Anmeldender Verein": team["Anmeldender Verein"] || "",
    Spieler: field_object_to_players(team)
  };
}

const dpv = {
  /**
   * Import DPV specific CSV format
   * @param  {string} string
   * @returns List of Objects with appropriate fields
   */
  import: {
    csv(string: string): dpv_registration[] {
      const csv_fields = csv.read(string).filter(line => !is_empty_array(line));

      if (get_name_header(csv_fields)) {
        csv_fields.shift();
      }

      const [field_names, ...team_fields] = csv_fields;

      return team_fields
        .map(fields => zipObject(field_names, fields))
        .map(field_object_to_registration)
        .filter(team => !is_empty_team(team));
    },
    csv_tournament_name(string: string): string | undefined {
      const csv_fields = csv.read(string).filter(line => !is_empty_array(line));

      return get_name_header(csv_fields);
    }
  }
};

export default dpv;
