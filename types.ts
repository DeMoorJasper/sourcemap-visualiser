export type SourceType = {
  name: string;
  content: string;
};

export type SourceMapType = {
  name: string;
  mappings: string;
  names: Array<string>;
  sources: Array<SourceType>;
  content: string;
};
