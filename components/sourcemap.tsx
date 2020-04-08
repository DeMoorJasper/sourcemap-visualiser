import React from "react";

import { decodeMap } from "../utils/decode-map";
import { SourceMapType } from "../types";
import SourceSelector from "./source-selector";
import MappingTree from "./mapping-tree";
import SourcePreview from "./source-preview";

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
    () => decodedMappings.filter((m) => m.sourceIndex === selectedSourceIndex),
    [selectedSourceIndex]
  );

  let selectedSource = sourcemap.sources[selectedSourceIndex];

  return (
    <div className="h-screen flex">
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
