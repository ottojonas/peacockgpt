import React, { useEffect, useState } from "react";
import axios from "axios";

interface Document {
  id: number;
  title: string;
}

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("/api/documents");
        setDocuments(response.data.documents);
      } catch (error) {
        setError("Error fetching documents");
        console.error(error);
      }
    };

    fetchDocuments();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Document List</h1>
      <ul>
        {documents.map((document) => (
          <li key={document.id}>{document.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;
