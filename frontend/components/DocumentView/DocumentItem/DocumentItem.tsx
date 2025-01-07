import React from "react";
import { DocumentItemType } from "../DocumentView";
import DocumentTitleItem from "./DocumentTitleItem";
import DocumentContentItem from "./DocumentContentItem";

interface DocumentItemProps {
  document: DocumentItemType;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  return (
    <div>
      <DocumentTitleItem document={document} />
      <DocumentContentItem document={document} />
    </div>
  );
};

export default DocumentItem;
