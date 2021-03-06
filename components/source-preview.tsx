import classNames from 'classnames';
import color from 'color';
import randomcolor from 'randomcolor';
import React from 'react';

import { SourceType } from '../types';
import { invertColor } from '../utils/color';
import { DecodedMapping } from '../utils/decode-map';

export type Props = {
  source: SourceType;
  mappings: Array<DecodedMapping>;
  allMappings: Array<DecodedMapping>;
  hoveredMapping: number;
  onHoverMapping: (mappingIndex: number) => any;
  selectedMapping: number;
  onSelectMapping: (mappingIndex: number) => any;
  generated: string;
};

const getRandomColor = (...seedValues: Array<number>) => {
  let seed = 1000;
  for (let seedValue of seedValues) {
    seed += seedValue * 1000;
  }

  return randomcolor({
    seed,
  });
};

export default function SourcePreview(props: Props) {
  let {
    source,
    mappings,
    allMappings,
    hoveredMapping,
    onHoverMapping,
    selectedMapping,
    onSelectMapping,
    generated,
  } = props;

  let renderableMappings = React.useMemo(() => {
    let result = [[]];
    let currColumn = 0;
    let currValue = {
      value: '',
      mapping: null,
      mappingIndex: -1,
    };
    let i = 0;
    for (let char of source.content) {
      let currLine = result.length - 1;
      if (char === '\n') {
        if (currValue.value) {
          result[currLine].push(currValue);
          currValue = {
            value: '',
            mapping: null,
            mappingIndex: -1,
          };
        }

        result.push([]);
        currColumn = 0;
        continue;
      }

      let currMapping = mappings[i];
      if (currMapping.originalLine === currLine && currMapping.originalColumn === currColumn) {
        if (currValue.value) {
          result[currLine].push(currValue);
        }

        currValue = {
          value: '',
          mapping: currMapping,
          mappingIndex: i,
        };
      }

      while (
        i < mappings.length - 1 &&
        (currMapping.originalLine < currLine ||
          (currMapping.originalLine === currLine && currMapping.originalColumn < currColumn) ||
          (currMapping.originalLine === currLine && currMapping.originalColumn === currColumn))
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
    if (!m) {
      return null;
    }

    let mappingIndex = allMappings.findIndex(
      (val) => val.generatedColumn === m.generatedColumn && val.generatedLine === m.generatedLine
    );

    let nextMapping = allMappings[mappingIndex + 1];
    let lines = generated.split('\n');
    let line = lines[m.generatedLine];
    let startColumn = m.generatedColumn;
    let endColumn = nextMapping?.generatedLine === m.generatedLine ? nextMapping.generatedColumn : line.length;

    if (!line.length) {
      return null;
    }

    return {
      line: m.originalLine,
      parts: [
        line.substring(startColumn - 10, startColumn),
        line.substring(startColumn, endColumn),
        line.substring(endColumn, endColumn + 10),
      ],
    };
  }, [selectedMapping, allMappings]);

  let lines = source.content.split('\n');
  let lineNumberWidth = lines.length.toString(10).length + 1;
  return (
    <div className="w-full h-full flex flex-col font-mono text-sm">
      {renderableMappings.map((m, i) => {
        return (
          <React.Fragment key={`line-${i}`}>
            <div className="flex flex-row">
              <div className="text-right px-2 bg-gray-200" style={{ width: `${lineNumberWidth}rem` }}>
                {i}
              </div>
              <div className="px-4 whitespace-pre">
                {m.map((map, x) => {
                  let style: any = {};
                  if (map.mapping) {
                    style.backgroundColor = getRandomColor(i, x);
                    style.color = invertColor(style.backgroundColor);

                    if (map.mappingIndex > -1) {
                      if (selectedMapping === map.mappingIndex) {
                        style.backgroundColor = '#000000';
                        style.color = '#ffffff';
                      } else if (hoveredMapping === map.mappingIndex) {
                        style.backgroundColor = color(style.backgroundColor).darken(0.25);
                      }
                    }
                  }

                  return (
                    <span
                      key={`line-${i}-mapping-${x}`}
                      className={classNames('rounded', {
                        'cursor-pointer': !!map.mapping,
                        'text-gray-600': !map.mapping,
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
            {generatedFragment?.line === i && (
              <div className="p-2">
                <span className="text-gray-500">{generatedFragment.parts[0]}</span>
                <span className="bg-black text-white">{generatedFragment.parts[1] || '[NOT FOUND]'}</span>
                <span className="text-gray-500">{generatedFragment.parts[2]}</span>
              </div>
            )}
          </React.Fragment>
        );
      })}
      <div className="flex flex-row h-full">
        <div className="flex px-2 bg-gray-200" style={{ width: `${lineNumberWidth}rem` }} />
        <div />
      </div>
    </div>
  );
}
