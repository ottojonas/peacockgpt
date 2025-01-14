import React, { useState, useEffect } from "react";
import axios from "axios";

export type DocumentItemType = {
  key: string;
  title: string;
  content: string;
  isSelected: boolean;
};

interface DocumentViewProps {
  documents: DocumentItemType[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItemType[]>>;
  documentKey: string;
  selectedDocumentKey: string;
  content: string;
}

const DocumentView: React.FC<DocumentViewProps> = ({}) => {
  return <></>;
};
export default DocumentView;
