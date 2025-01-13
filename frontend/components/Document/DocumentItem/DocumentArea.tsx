import React from "react";
import { DocumentItem } from "../Document";

interface DocumentItemProps {
  document: DocumentItem;
}

const DocumentArea: React.FC<DocumentItemProps> = ({ document }) => {
  return (
    <div className="py-2" key={document.key} data-testid="document-area">
      <div className="flex p-2 rounded-md bg-item">
        <div className="w-full"></div>
        <div
          className="px-3 pb-3 text-white"
          dangerouslySetInnerHTML={{ __html: document.content }}
        ></div>
      </div>
    </div>
  );
};

export default DocumentArea;
