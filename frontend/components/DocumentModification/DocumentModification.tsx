import React, { useEffect } from "react";
import axios from "axios";

export type DocumentItemType = {
  key: string;
  title: string;
  content: string;
};

interface Props {
  saveContent: (newContent: string) => void;
  setInputValue: (value: string) => void;
  inputValue: string;
  documents: DocumentItemType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItemType[]>>;
  key: string;
}

const DocumentModification: React.FC<Props> = ({
  saveContent,
  inputValue,
  setInputValue,
  documents,
  setDocuments,
  key,
}) => {
  const handleSave = async () => {
    try {
      await axios.put(`/api/documents?key=${key}`, {
        content: inputValue,
      });
      saveContent(inputValue);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  useEffect(() => {
    const document = documents.find((doc) => doc.key === key);
    if (document) {
      setInputValue(document.content);
    }
  }, [key, documents, setInputValue]);
  return (
    <div>
      <h1>Modify Document</h1>
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        rows={10}
        cols={50}
      />

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};
export default DocumentModification;
