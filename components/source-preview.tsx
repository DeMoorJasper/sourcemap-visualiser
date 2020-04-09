import React from "react";
import classNames from "classnames";
// @ts-ignore
import colors from "nice-color-palettes/1000";
import color from "color";

import { SourceType } from "../types";
import { DecodedMapping } from "../utils/decode-map";
import { invertColor } from "../utils/color";

export type Props = {
  source: SourceType;
  mappings: Array<DecodedMapping>;
  hoveredMapping: number;
  onHoverMapping: (mappingIndex: number) => any;
  selectedMapping: number;
  onSelectMapping: (mappingIndex: number) => any;
};

export default function SourcePreview(props: Props) {
  let {
    source,
    mappings,
    hoveredMapping,
    onHoverMapping,
    selectedMapping,
    onSelectMapping,
  } = props;

  let renderableMappings = React.useMemo(() => {
    let result = [[]];
    let currColumn = 0;
    let currValue = {
      value: "",
      mapping: null,
      mappingIndex: -1,
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
            mappingIndex: -1,
          };
        }

        result.push([]);
        currColumn = 0;
        continue;
      }

      let currMapping = mappings[i];
      if (
        currMapping.originalLine === currLine &&
        currMapping.originalColumn === currColumn
      ) {
        if (currValue.value) {
          result[currLine].push(currValue);
        }

        currValue = {
          value: "",
          mapping: currMapping,
          mappingIndex: i,
        };
      }

      while (
        i < mappings.length - 1 &&
        (currMapping.originalLine < currLine ||
          (currMapping.originalLine === currLine &&
            currMapping.originalColumn < currColumn) ||
          (currMapping.originalLine === currLine &&
            currMapping.originalColumn === currColumn))
      ) {
        i++;
        currMapping = mappings[i];
      }

      currValue.value += char;

      currColumn++;
    }

    return result;
  }, [source.name]);

  let generatedFragment = React.useMemo(() => {
    if (selectedMapping < 0) {
      return null;
    }

    let m = mappings[selectedMapping];
    return {
      line: m.originalLine,
    };
  }, [selectedMapping]);

  let lines = source.content.split("\n");
  let lineNumberWidth = lines.length.toString(10).length + 1;
  let lastMappingColor = 0;
  return (
    <div className="w-full h-full flex flex-col">
      {renderableMappings.map((m, i) => {
        return (
          <React.Fragment key={`line-${i}`}>
            <div className="flex flex-row">
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

                    if (map.mappingIndex > -1) {
                      if (selectedMapping === map.mappingIndex) {
                        style.backgroundColor = "#000000";
                        style.color = "#ffffff";
                      } else if (hoveredMapping === map.mappingIndex) {
                        style.backgroundColor = color(
                          style.backgroundColor
                        ).darken(0.25);
                      }
                    }

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
                      onMouseEnter={() => {
                        if (map.mappingIndex > -1) {
                          onHoverMapping(map.mappingIndex);
                        }
                      }}
                      onMouseLeave={() => onHoverMapping(-1)}
                      onClick={() => {
                        if (map.mappingIndex > -1) {
                          onSelectMapping(map.mappingIndex);
                        }
                      }}
                    >
                      {map.value}
                    </span>
                  );
                })}
              </div>
            </div>
            {generatedFragment && generatedFragment.line === i && (
              <div className="p-2">
                Here comes a highlight of generated code
              </div>
            )}
          </React.Fragment>
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
