import { decode } from "sourcemap-codec";

export type DecodedMapping = {
  generatedLine: number;
  generatedColumn: number;
  sourceLine: number;
  sourceColumn: number;
  sourceIndex: number;
  name?: string;
};

export function decodeMap(
  mappings: string,
  names: Array<string>
): Array<DecodedMapping> {
  let decoded = decode(mappings);

  let currentLine = 0;
  let result: Array<DecodedMapping> = [];
  for (let line of decoded) {
    for (let mapping of line) {
      let hasSource = mapping.length > 1;
      let hasName = mapping.length > 4;

      result.push({
        generatedLine: currentLine,
        generatedColumn: mapping[0],
        sourceLine: hasSource ? mapping[2] : -1,
        sourceColumn: hasSource ? mapping[3] : -1,
        sourceIndex: hasSource ? mapping[1] : -1,
        name: hasName ? names[mapping[4]] : null,
      });
    }

    currentLine++;
  }

  return result;
}
