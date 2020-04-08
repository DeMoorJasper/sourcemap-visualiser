import React from "react";

import { DecodedMapping } from "../utils/decode-map";

export type Props = {
  mappings: Array<DecodedMapping>;
};

export default function MappingTree(props: Props) {
  let { mappings } = props;

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="font-medium text-gray-700 p-2">Mappings</div>
      <div>
        {mappings.map((mapping, i) => {
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
