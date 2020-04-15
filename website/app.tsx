import React from "react";

import Dropzone from "./dropzone";
import { SourceMapType } from "~/types";
import SourceMap from "~/components/sourcemap";
import Visualizer from "~/components/visualizer";

export default function App() {
  let [sourcemapContent, setSourcemapContent] = React.useState<
    Array<SourceMapType>
  >([]);

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
    return <Visualizer sourcemapContent={sourcemapContent} />;
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
