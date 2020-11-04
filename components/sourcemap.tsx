import React from 'react';

import { SourceMapType } from '../types';
import { DecodedMapping, decodeMap } from '../utils/decode-map';
import MappingTree from './mapping-tree';
import SourcePreview from './source-preview';
import SourceSelector from './source-selector';

// This is just a variable to be able to sort
// it's not the best way but it was the easiest way I came up with in 5 secs
const MAX_LINE_LENGTH = 10000;

export type Props = {
  sourcemap: SourceMapType;
};

export default function SourceMap(props: Props) {
  let { sourcemap } = props;

  let [selectedSourceIndex, setSelectedSourceIndex] = React.useState(0);
  let [hoveredMapping, setHoveredMapping] = React.useState(-1);
  let [selectedMapping, setSelectedMapping] = React.useState(-1);

  let decodedMappings = React.useMemo(() => {
    return decodeMap(sourcemap.mappings, sourcemap.names);
  }, [sourcemap.mappings]);

  let mappingsSortedByGenerated: Array<DecodedMapping> = React.useMemo(() => {
    return decodedMappings.sort((a, b) => {
      let lineDiff = a.generatedLine - b.generatedLine;
      if (lineDiff === 0) {
        return a.generatedColumn - b.generatedColumn;
      } else {
        return lineDiff;
      }
    });
  }, [decodedMappings]);

  let filteredMappings = React.useMemo(() => {
    return decodedMappings
      .filter((m) => {
        return m.sourceIndex === selectedSourceIndex;
      })
      .sort((a, b) => {
        let aValue = a.originalLine != null ? a.originalLine * MAX_LINE_LENGTH + a.originalColumn : Number.MAX_VALUE;
        let bValue = b.originalLine != null ? b.originalLine * MAX_LINE_LENGTH + b.originalColumn : Number.MAX_VALUE;
        return aValue - bValue;
      });
  }, [selectedSourceIndex, decodedMappings]);

  const changeSourceIndex = (i: number) => {
    setSelectedMapping(-1);
    setHoveredMapping(-1);
    setSelectedSourceIndex(i);
  };

  let selectedSource = sourcemap.sources[selectedSourceIndex];
  return (
    <div className="h-full flex">
      <div className="w-1/6">
        <SourceSelector selectedSource={selectedSourceIndex} onSelect={changeSourceIndex} sources={sourcemap.sources} />
      </div>
      <div className="w-4/6 overflow-y-auto">
        {selectedSource.content ? (
          <SourcePreview
            source={selectedSource}
            mappings={filteredMappings}
            allMappings={mappingsSortedByGenerated}
            hoveredMapping={hoveredMapping}
            onHoverMapping={setHoveredMapping}
            selectedMapping={selectedMapping}
            onSelectMapping={setSelectedMapping}
            generated={sourcemap.content}
          />
        ) : (
          <div className="p-2">No source content found for {selectedSource.name}</div>
        )}
      </div>
      <div className="w-1/6">
        <MappingTree
          mappings={filteredMappings}
          hoveredMapping={hoveredMapping}
          onHoverMapping={setHoveredMapping}
          selectedMapping={selectedMapping}
          onSelectMapping={setSelectedMapping}
        />
      </div>
    </div>
  );
}
