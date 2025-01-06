import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import io from "socket.io-client";
import DocumentList from "../components/DocumentList/DocumentList";
import CustomHead from "../components/common/CustomHead";

const Documents = () => {
  return (
    <>
      <CustomHead title="Document Modification" />
      <Sidebar />
      <DocumentList />
    </>
  );
};
export default Documents;
