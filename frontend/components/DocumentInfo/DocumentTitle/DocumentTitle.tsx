import axios from "axios";
import React, { useEffect } from "react";

interface DocumentTitleProps {}

const DocumentTitle: React.FC = () => {
  useEffect(() => {
    const fetchDocumentTitle = async () => {
      try {
        const response = await axios.get("/api/documents", { params: {} });
      } catch (error) {
        console.error("Could not fetch document title: ", error);
      }
    };
  }, []);
  return <></>;
};

export default DocumentTitle;
