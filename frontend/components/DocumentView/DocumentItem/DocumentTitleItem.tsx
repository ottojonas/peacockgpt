import React from "react";
import { DocumentItemType } from "../DocumentView";

interface DocumentTitleItemProps {
  document: DocumentItemType;
}

const DocumentTitleItem: React.FC<DocumentTitleItemProps> = ({ document }) => {
  return (
    <div className="py-2" key={document.key} data-testid="document-title-item">
      <div className="flex p-2 rounded-md bg-item">
        <div className="w-full">
          <div className="flex items-center justify-between h-10 px-3 grow text-brandGray">
            <div className="px-3 pb-3 text-white">
              <h3 className="font-semibold">{document.title}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTitleItem;