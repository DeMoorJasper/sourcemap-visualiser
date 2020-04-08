import React from "react";

import { SourceType } from "../types";

export type Props = {
  source: SourceType;
};

export default function SourcePreview(props: Props) {
  let { source } = props;

  let lines = source.content.split("\n");
  let lineNumberWidth = lines.length.toString(10).length;
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
            <div className="flex items-center px-4">{line}</div>
          </div>
        );
      })}
    </div>
  );
}
