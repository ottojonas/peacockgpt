import axios from "axios";
import React, { useEffect, useState } from "react";
import { DocumentInfoItem } from "../DocumentInfo";

interface DocumentTitleProps {
  title: string;
}

const DocumentTitle: React.FC<DocumentTitleProps> = ({ title }) => {
  return (
    <div className="py-2" data-testid="document-title">
      <div className="flex p-2 rounded-md bg-item">
        <div className="w-12 shrink">
          <div className="w-full">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTitle;
