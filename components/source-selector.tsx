import React from "react";
import path from "path";
import classNames from "classnames";

import { SourceType } from "../types";

export type Props = {
  sources: Array<SourceType>;
  selectedSource: number;
  onSelect: (selected: number) => any;
};

export default function SourceSelector(props: Props) {
  let { sources, selectedSource, onSelect } = props;

  return (
    <div className="h-full bg-gray-800 overflow-y-auto">
      <div className="font-medium text-white p-2 bg-gray-600">Sources</div>
      <div className="overflow-y-auto">
        {sources.map((s, i) => {
          let shortSourceName =
            path.basename(path.dirname(s.name)) + "/" + path.basename(s.name);

          return (
            <div
              className={classNames(
                "whitespace-no-wrap text-white px-2 py-1 hover:bg-gray-500 cursor-pointer",
                {
                  "bg-gray-700": selectedSource === i,
                }
              )}
              onClick={() => {
                onSelect(i);
              }}
            >
              {shortSourceName}
            </div>
          );
        })}
      </div>
    </div>
  );
}
