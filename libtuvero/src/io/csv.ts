/**
 * Extract words from CSV line. Internal function.
 * @param  {string} comma-separated line
 * @returns array of fields. [] if line is empty
 */
function _line2fields(line: string) {
  const fields = [];

  // helps with trailing empty fields (e.g. 'a,b,,,').
  // Would otherwise be ignored.
  line = `${line} `;

  while (line.length > 0) {
    const match =
      line.match(/^\s*"([^"]+|"")*"\s*(,|;|$)/) ||
      line.match(/^\s*[^,;]*\s*(,|;|$)/);

    const field = match![0];
    line = line.substr(field.length);
    fields.push(
      field.replace(/[,;]$/, "").replace(/^\s+|\s*$/g, "").replace(/^"|"$/g, "")
    );
  }

  return fields;
}

const csv = {
  /**
   * Convert CSV string to 2D array of fields
   * @param  {string} string
   * @returns 2D array of fields
   */
  read(string: string): string[][] {
    return string
      .split("\n")
      .filter(line => !line.match(/^\s*$/))
      .map(_line2fields);
  }
};

export default csv;
