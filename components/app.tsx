import React from "react";

import Dropzone from "./dropzone";
import { SourceMapType } from "../types";
import SourceMap from "./sourcemap";

export default function App() {
  let [sourcemapContent, setSourcemapContent] = React.useState<
    Array<SourceMapType>
  >([]);
  let [selectedSourceMapIndex, setSelectedSourceMapIndex] = React.useState(0);

  const handleSourceMapUpload = async (file: File) => {
    try {
      let fileContent = await file.text();
      let parsed = JSON.parse(fileContent);

      if (Array.isArray(parsed)) {
        setSourcemapContent(parsed);
      } else {
        alert("File does not appear to be a sourcemap-info file.");
      }
    } catch (e) {
      alert("Could not load file. Should be a valid JSON File.");
    }
  };

  if (sourcemapContent.length) {
    let selectedSourceMap = sourcemapContent[selectedSourceMapIndex];

    return (
      <div className="h-screen">
        <div className="bg-gray-700 p-2 flex">
          <div className="text-white mr-4">Select Bundle</div>
          <select
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
  } else {
    return (
      <div className="max-w-xl mx-auto p-16">
        <div className="font-medium text-lg text-gray-700">
          Upload your <span className="underline">sourcemap-info.json</span> to
          get started
        </div>
        <div className="mt-4">
          <Dropzone onUpload={handleSourceMapUpload} />
        </div>
      </div>
    );
  }
}
