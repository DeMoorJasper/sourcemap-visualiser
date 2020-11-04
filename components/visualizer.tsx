import React from 'react';

import { SourceMapType } from '../types';
import SourceMap from './sourcemap';

export type Props = {
  sourcemapContent: Array<SourceMapType>;
};

export default function Visualizer({ sourcemapContent }: Props) {
  let [selectedSourceMapIndex, setSelectedSourceMapIndex] = React.useState(0);

  if (sourcemapContent.length > 0) {
    let selectedSourceMap = sourcemapContent[selectedSourceMapIndex];

    return (
      <div id="sourcemap-visualizer" className="font-sans leading-normal h-full flex flex-col">
        <div className="bg-gray-700 p-2 flex">
          <div className="text-white mr-4">Select Bundle</div>
          <select
            className="border-none"
            onChange={(e) => {
              setSelectedSourceMapIndex(parseInt(e.target.value, 10));
            }}
          >
            {sourcemapContent.map((v, i) => {
              return (
                <option value={i} key={v.name}>
                  {v.name}
                </option>
              );
            })}
          </select>
        </div>
        <SourceMap sourcemap={selectedSourceMap} />
      </div>
    );
  }
}
