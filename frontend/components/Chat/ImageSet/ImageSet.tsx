import LinkIcon from "@/components/icons/LinkIcon";
import React from "react";

export default function ImageSet({
  images,
}: {
  images: { key: number; url: string }[];
}) {
  return (
    <div className="px-3 flex justify-center py-5">
      <div className="inline-flex relative">
        {images.map(({ key, url }, index) => (
          <div
            className=" p-0.5 rounded-md bg-[#95aa55]"
            key={key}
            style={{
              transform: `rotate(${index % 2 ? 6 : -6}deg)`,
              transformOrigin: "50% 50%",
              marginLeft: "-40px",
            }}
          >
            <img className="w-36 h-36 rounded-md" src={url} />
          </div>
        ))}

        <button
          className="absolute w-9 h-9 bg-brandBlue rounded-full grid place-items-center text-white"
          style={{ right: "14px", top: "5px" }}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
