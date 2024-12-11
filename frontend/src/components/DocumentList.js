import React, { useEffect, useState } from "react";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch("/documents");
      const data = await response.json();
      setDocuments(data);
    };

    fetchDocuments();
  }, []);

  return (
    <div className="document-list">
      <h2>Uploaded Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>{doc.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;
