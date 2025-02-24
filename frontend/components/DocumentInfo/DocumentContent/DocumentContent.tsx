import axios from "axios";
import React, { useEffect } from "react";

interface DocumentContentProps {}

const DocumentContent: React.FC = () => {
  useEffect(() => {
    const fetchDocumentContent = async () => {
      try {
        const resonse = await axios.get("/api/documents", { params: {} });
      } catch (error) {
        console.error("Could not fetch document content: ", error);
      }
    };
  });

  return <></>;
};

export default DocumentContent;
