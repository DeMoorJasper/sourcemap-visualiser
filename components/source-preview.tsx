import React from "react";

import { SourceType } from "../types";
import { DecodedMapping } from "../utils/decode-map";

export type Props = {
  source: SourceType;
  mappings: Array<DecodedMapping>;
};

export default function SourcePreview(props: Props) {
  let { source, mappings } = props;

  let lines = source.content.split("\n");
  let lineNumberWidth = lines.length.toString(10).length + 1;
  return (
    <div className="w-full h-full flex flex-col">
      {lines.map((line, i) => {
        return (
          <div className="flex flex-row">
            <div
              className="flex items-center justify-end px-2 bg-gray-200"
              style={{ width: `${lineNumberWidth}rem` }}
            >
              {i}
            </div>
            <div className="flex items-center px-4 whitespace-pre">{line}</div>
          </div>
        );
      })}
      <div className="flex flex-row h-full">
        <div
          className="flex px-2 bg-gray-200"
          style={{ width: `${lineNumberWidth}rem` }}
        />
        <div />
      </div>
    </div>
  );
}
