import React, { useEffect } from "react";
import axios from "axios";
import Mic from "../icons/Mic";

type DocumentItem = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

interface Props {
  saveDocument: (content: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  documentKey: string;
}

const DocumentInput: React.FC<Props> = ({
  saveDocument,
  inputValue,
  setInputValue,
  documents,
  setDocuments,
  documentKey,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveDocument();
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/api/documents`, {
          params: { documentKey: documentKey },
        });
      } catch (error) {
        console.error("Error loading documents:", error);
      }
    };
    if (documentKey) {
      fetchContent();
    }

    return () => {};
  }, [documentKey]);

  const handleSaveDocument = async () => {
    if (!inputValue.trim()) {
      console.error("Message content is empty");
      return;
    }
    saveDocument(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 pt-8 bg-input">
      <div style={{ marginLeft: "348px", marginRight: "320px" }}>
        <div className="max-w-3xl px-4 pb-3 mx-auto">
          <div className="relative rounded-md bg-card">
            <textarea
              rows={100}
              className="w-full px-4 py-2 rounded-md resize-none bg-card"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Document content"
            />
            <div
              className="absolute flex items-center space-x-3"
              style={{
                right: "16px",
                top: "50%",
                transform: "translate(0, -50%)",
              }}
            >
              <button
                className="grid w-10 h-10 text-white rounded-md place-items-center"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentInput;
