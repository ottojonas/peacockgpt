import React from "react";
import Options from "../../components/icons/Options";
import Times from "../../components/icons/Times";
import trending from "./trending.json";
import TrendingIcon from "../../components/icons/TrendingIcon";
import StarIcon from "../../components/icons/StarIcon";
import WarningIcon from "../../components/icons/WarningIcon";
import DownloadIcon from "../icons/DownloadIcon/DownloadIcon";

// TODO

type Props = {};

export default function Info({}: Props) {
  return (
    <div className="fixed top-0 right-0 z-10 h-screen p-3 border-l-2 border-l-line w-80 bg-body">
      <div className="flex justify-end">
        <Times className="w-5 h-5" />
      </div>
      <Heading text="Capabilities" />
      <div className="flex space-x-2">
        <div className="w-1/2 p-2 rounded-md bg-card">
          <div className="grid rounded-full w-9 h-9 bg-brandWhite place-items-center">
            <StarIcon className="w-5 h-5 text-blue-900" />
          </div>
          <p className="mt-4 text-sm">Troubleshooting application issues</p>
        </div>
        <div className="w-1/2 p-2 rounded-md bg-card">
          <div className="w-9 h-9 rounded-full grid place-items-center bg-[#3a3a3c]">
            <StarIcon className="w-5 h-5 text-white" />
          </div>
          <p className="mt-4 text-sm">Explaining system processes</p>
        </div>
      </div>
      <Heading text="Limitations" />
      <div className="flex space-x-2">
        <div className="w-1/2 p-2 rounded-md bg-card">
          <div className="grid rounded-full w-9 h-9 bg-brandWhite place-items-center">
            <WarningIcon className="w-5 h-5 text-blue-900" />
          </div>
          <p className="mt-4 text-sm">Custom solution restraints</p>
        </div>
        <div className="w-1/2 p-2 rounded-md bg-card">
          <div className="w-9 h-9 rounded-full bg-[#3a3a3c] grid place-items-center">
            <WarningIcon className="w-5 h-5 text-white" />
          </div>
          <p className="mt-4 text-sm">Geographical and Logistical Restraints</p>
        </div>
      </div>
      <Heading text="Download The User Guide" />
      <div className="px-2 py-2 shrink-0">
        <a
          href="usage-documentation-download-link-here"
          download
          className="flex items-center justify-center w-full py-2 text-sm font-semibold text-white rounded-md bg-card"
        >
          <DownloadIcon className="w-5 h-5" />
          <span className="ml-2">User Guide</span>
        </a>
      </div>
    </div>
  );
}

type HeadingProps = {
  text: string;
};
function Heading({ text }: HeadingProps) {
  return (
    <div className="flex items-center justify-between mt-3 mb-1">
      <h3 className="text-md">{text}</h3>
    </div>
  );
}
