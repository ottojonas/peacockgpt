import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Options from "../icons/Options";
import Times from "../icons/Times";
import PencilSquareIcon from "../icons/PencilSquareIcon";
import SearchIcon from "../icons/SearchIcon";
import ListAllIcon from "../icons/ListAllIcon";

type DocumentProps = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

type Props = {
  setDocuments: (documents: DocumentItem[]) => void;
};

const createNewDocument = (): DocumentProps => {
  return {
    key: uuidv4(),
    title: "Placeholder",
    content: "Placeholder",
    isSelected: true,
  };
};

const DocumentList: React.FC<Props> = ({}) => {
  const handleNewDocument = () => {};

  const fetchDocuments = async () => {
    try {
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  return (
    <div className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body">
      <div className="flex items-center px-3 py-3 shrink-0">
        <h2 className="text-lg font-semibold shrink-0">Documents</h2>
        <div className="grid w-8 h-8 ml-2 text-sm font-semibold text-black rounded-full shrink-0 bg-brandWhite place-items-center">
          {}
        </div>
        <div className="grow"></div>
        <button>
          <Options className="w-7 h-7" />
        </button>
      </div>
      <div className="flex px-3 space-x-2 shrink-0">
        <div className="relative h-10 rounded-md grow bg-card">
          <input
            className="w-full h-10 pl-4 pr-10 rounded-md bg-card"
            spellCheck={false}
            data-ms-editor={false}
          />
          <div className="absolute inset-y-0 right-0 grid w-10 place-items-center">
            <SearchIcon className="w-5 h-5 text-brandGray" />
          </div>
        </div>
        <div
          className="grid w-10 h-10 rounded-md bg-brandWhite place-items-center shrink-0"
          onClick={handleNewDocument}
        >
          <PencilSquareIcon className="w-5 h-5 text-brandBlue" />
        </div>
      </div>
      <div className="flex items-center px-3 mt-4 mb-1 uppercase shrink-0">
        <ListAllIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-semibold">All</span>
      </div>
      <div className="grow"></div>
    </div>
  );
};

function Documents({}: {}) {}

export default DocumentList;
