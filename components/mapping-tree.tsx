import React from "react";

import { SourceType } from "../types";
import { DecodedMapping } from "../utils/decode-map";

export type Props = {
  mappings: Array<DecodedMapping>;
  names: Array<string>;
  selectedSourceIndex: number;
  selectedSource: SourceType;
};

export default function MappingTree(props: Props) {
  let { mappings, names, selectedSourceIndex, selectedSource } = props;
  let filteredMappings = React.useMemo(
    () => mappings.filter((m) => m.sourceIndex === selectedSourceIndex),
    [selectedSourceIndex]
  );

  return (
    <div className="h-full">
      <div className="font-medium text-gray-700 p-2">Mapping Tree</div>
      <div className="h-full overflow-y-auto">
        {filteredMappings.map((mapping) => {
          return (
            <div className="px-2 font-medium text-gray-700 whitespace-no-wrap	">
              <span>
                {mapping.sourceLine}:{mapping.sourceColumn}
              </span>
              <span className="mx-1">-</span>
              <span>
                {mapping.generatedLine}:{mapping.generatedColumn}
              </span>
              {mapping.name && (
                <span className="font-normal text-gray-600 ml-2">
                  ({mapping.name})
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
