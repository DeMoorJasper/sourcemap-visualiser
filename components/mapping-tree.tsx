import React from "react";

import { DecodedMapping } from "../utils/decode-map";

export type Props = {
  mappings: Array<DecodedMapping>;
  selectedSourceIndex: number;
};

export default function MappingTree(props: Props) {
  let { mappings, selectedSourceIndex } = props;
  let filteredMappings = React.useMemo(
    () => mappings.filter((m) => m.sourceIndex === selectedSourceIndex),
    [selectedSourceIndex]
  );

  return (
    <div className="h-full bg-gray-100">
      <div className="font-medium text-gray-700 p-2">Mappings</div>
      <div className="h-full overflow-y-auto">
        {filteredMappings.map((mapping, i) => {
          return (
            <div
              className="px-2 font-medium text-gray-700 whitespace-no-wrap"
              key={i}
            >
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
