import classNames from 'classnames';
import React from 'react';

import { DecodedMapping } from '../utils/decode-map';

export type Props = {
  mappings: Array<DecodedMapping>;
  hoveredMapping: number;
  onHoverMapping: (mappingIndex: number) => any;
  selectedMapping: number;
  onSelectMapping: (mappingIndex: number) => any;
};

export default function MappingTree(props: Props) {
  let { mappings, hoveredMapping, onHoverMapping, selectedMapping, onSelectMapping } = props;

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="font-medium text-gray-700 p-2">Mappings</div>
      <div>
        {mappings.map((mapping, i) => {
          return (
            <div
              className={classNames('px-2 font-medium text-gray-700 whitespace-no-wrap cursor-pointer', {
                underline: hoveredMapping === i,
                'bg-blue-200': selectedMapping === i,
              })}
              key={i}
              onMouseEnter={() => onHoverMapping(i)}
              onMouseLeave={() => onHoverMapping(-1)}
              onClick={() => onSelectMapping(i)}
            >
              <span>
                {mapping.originalLine}:{mapping.originalColumn}
              </span>
              <span className="mx-1">-</span>
              <span>
                {mapping.generatedLine}:{mapping.generatedColumn}
              </span>
              {mapping.name && <span className="font-normal text-gray-600 ml-2">({mapping.name})</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
