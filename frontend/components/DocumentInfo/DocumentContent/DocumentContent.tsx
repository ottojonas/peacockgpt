import axios from "axios";
import React, { useEffect } from "react";
import { DocumentInfoItem } from "../DocumentInfo";
interface DocumentContentProps {
  content: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ content }) => {
  return (
    <div className="py-2" data-testid="document-content">
      <div className="flex p-2 rounded-md bg-item">
        <div className="w-full overflow-auto">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentContent;
