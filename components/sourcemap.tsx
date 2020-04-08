import React from "react";

import { decodeMap } from "../utils/decode-map";
import { SourceMapType } from "../types";
import SourceSelector from "./source-selector";
import MappingTree from "./mapping-tree";

export type Props = {
  sourcemap: SourceMapType;
};

export default function SourceMap(props: Props) {
  let { sourcemap } = props;
  let [selectedSource, setSelectedSource] = React.useState(0);
  let decodedMappings = React.useMemo(
    () => decodeMap(sourcemap.mappings, sourcemap.names),
    [sourcemap.mappings]
  );

  console.log(decodedMappings);

  return (
    <div className="h-full flex">
      <div className="h-full w-1/6">
        <SourceSelector
          selectedSource={selectedSource}
          onSelect={setSelectedSource}
          sources={sourcemap.sources}
        />
      </div>
      <div className="w-4/6">{/* Interactive source-code visualisation */}</div>
      <div className="w-1/6">
        <MappingTree
          mappings={decodedMappings}
          selectedSourceIndex={selectedSource}
          selectedSource={sourcemap.sources[selectedSource]}
          names={sourcemap.names}
        />
      </div>
    </div>
  );
}
