import axios from "axios";
import React, { useEffect, useState } from "react";
import { DocumentInfoItem } from "../DocumentInfo";

interface DocumentTitleProps {
  title: string;
  setTitle: (title: string) => void;
}

const DocumentTitle: React.FC<DocumentTitleProps> = ({ title, setTitle }) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  return (
    <div className="py-2" data-testid="document-title">
      <div className="flex p-2 rounded-md bg-item">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full p-2 text-black border rounded"
        />
      </div>
    </div>
  );
};

export default DocumentTitle;
