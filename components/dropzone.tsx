import React from "react";
import classNames from "classnames";

export type Props = {
  onUpload: (file: File) => any;
  disabled?: boolean;
};

export default function Dropzone(props: Props) {
  let { onUpload, disabled } = props;
  let [ref, setRef] = React.useState<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    let files = e.target.files;
    if (!files) {
      return;
    }

    onUpload(files[0]);
  };

  const handleClick = () => {
    if (disabled) return;

    if (ref) {
      // @ts-ignore
      ref.dispatchEvent(new MouseEvent("click"));
    }
  };

  return (
    <div
      className={classNames(
        "w-full border-dashed border-gray-400 text-gray-400 border-2 rounded",
        {
          "cursor-pointer hover:border-gray-500": !disabled,
        }
      )}
      onClick={handleClick}
    >
      <div className="w-full flex items-center justify-center h-40">
        Click here or drag a file into this box to upload a file
      </div>
      <input
        type="file"
        multiple={false}
        accept="application/json"
        onChange={handleFileUpload}
        className="hidden"
        ref={(r) => setRef(r)}
      ></input>
    </div>
  );
}
