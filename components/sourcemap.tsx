import React from "react";

import { decodeMap } from "../utils/decode-map";
import { SourceMapType } from "../types";
import SourceSelector from "./source-selector";
import MappingTree from "./mapping-tree";
import SourcePreview from "./source-preview";

// This is just a variable to be able to sort
// it's not the best way but it was the easiest way I came up with in 5 secs
const MAX_LINE_LENGTH = 10000;

export type Props = {
  sourcemap: SourceMapType;
};

export default function SourceMap(props: Props) {
  let { sourcemap } = props;
  let [selectedSourceIndex, setSelectedSourceIndex] = React.useState(0);
  let decodedMappings = React.useMemo(
    () => decodeMap(sourcemap.mappings, sourcemap.names),
    [sourcemap.mappings]
  );

  let filteredMappings = React.useMemo(
    () =>
      decodedMappings
        .filter((m) => {
          return m.sourceIndex === selectedSourceIndex;
        })
        .sort((a, b) => {
          let aValue = a.sourceLine * MAX_LINE_LENGTH + a.sourceColumn;
          let bValue = b.sourceLine * MAX_LINE_LENGTH + b.sourceColumn;
          return aValue - bValue;
        }),
    [selectedSourceIndex]
  );

  let selectedSource = sourcemap.sources[selectedSourceIndex];

  return (
    <div className="h-full flex">
      <div className="w-1/6">
        <SourceSelector
          selectedSource={selectedSourceIndex}
          onSelect={setSelectedSourceIndex}
          sources={sourcemap.sources}
        />
      </div>
      <div className="w-4/6 overflow-y-auto">
        {selectedSource.content ? (
          <SourcePreview source={selectedSource} mappings={filteredMappings} />
        ) : (
          <div className="p-2">
            No source content found for {selectedSource.name}
          </div>
        )}
      </div>
      <div className="w-1/6">
        <MappingTree mappings={filteredMappings} />
      </div>
    </div>
  );
}
