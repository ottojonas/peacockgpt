import React, { useState, useEffect } from "react";

const DocumentViewer = ({ docId }) => {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      const response = await fetch(`/documents/${docId}`);
      const data = await response.json();
      setDocument(data);
    };

    fetchDocument();
  }, [docId]);

  if (!document) {
    return <div>Loading...</div>;
  }

  return (
    <div className="document-viewer">
      <h2>{document.title}</h2>
      <p>{document.content}</p>
    </div>
  );
};

export default DocumentViewer;
