import axios from "axios";
import React, { useEffect } from "react";
import { DocumentInfoItem } from "../DocumentInfo";

interface DocumentContentProps {
  content: string;
  setContent: (content: string) => void;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  content,
  setContent,
}) => {
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };
  return (
    <div className="py-2" data-testid="document-content">
      <div className="flex p-2 rounded-md bg-item">
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full p-2 text-black border rounded"
          rows={10}
        />
      </div>
    </div>
  );
};

export default DocumentContent;
