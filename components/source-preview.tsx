import React from "react";
import classNames from "classnames";
// @ts-ignore
import colors from "nice-color-palettes/1000";

import { SourceType } from "../types";
import { DecodedMapping } from "../utils/decode-map";
import { invertColor } from "../utils/color";

export type Props = {
  source: SourceType;
  mappings: Array<DecodedMapping>;
};

export default function SourcePreview(props: Props) {
  let { source, mappings } = props;

  let renderableMappings = React.useMemo(() => {
    let result = [[]];
    let currColumn = 0;
    let currValue = {
      value: "",
      mapping: null,
    };
    let i = 0;
    for (let char of source.content) {
      let currLine = result.length - 1;
      if (char === "\n") {
        if (currValue.value) {
          result[currLine].push(currValue);
          currValue = {
            value: "",
            mapping: null,
          };
        }

        result.push([]);
        currColumn = 0;
        continue;
      }

      let currMapping = mappings[i];
      if (
        currMapping.sourceLine === currLine &&
        currMapping.sourceColumn === currColumn
      ) {
        if (currValue.value) {
          result[currLine].push(currValue);
        }

        currValue = {
          value: "",
          mapping: currMapping,
        };
      }

      while (
        i < mappings.length - 1 &&
        (currMapping.sourceLine < currLine ||
          (currMapping.sourceLine === currLine &&
            currMapping.sourceColumn < currColumn) ||
          (currMapping.sourceLine === currLine &&
            currMapping.sourceColumn === currColumn))
      ) {
        i++;
        currMapping = mappings[i];
      }

      currValue.value += char;

      currColumn++;
    }

    return result;
  }, [source.name]);

  let lines = source.content.split("\n");
  let lineNumberWidth = lines.length.toString(10).length + 1;
  let lastMappingColor = 0;
  return (
    <div className="w-full h-full flex flex-col">
      {renderableMappings.map((m, i) => {
        return (
          <div className="flex flex-row" key={`line-${i}`}>
            <div
              className="text-right px-2 bg-gray-200"
              style={{ width: `${lineNumberWidth}rem` }}
            >
              {i}
            </div>
            <div className="px-4 whitespace-pre">
              {m.map((map, x) => {
                let style: any = {};
                if (map.mapping) {
                  style.backgroundColor =
                    colors[lastMappingColor % 5000][lastMappingColor % 5];
                  style.color = invertColor(style.backgroundColor);
                  lastMappingColor++;
                }

                return (
                  <span
                    key={`line-${i}-mapping-${x}`}
                    className={classNames("rounded", {
                      "cursor-pointer": !!map.mapping,
                      "text-gray-600": !map.mapping,
                    })}
                    style={style}
                  >
                    {map.value}
                  </span>
                );
              })}
            </div>
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
