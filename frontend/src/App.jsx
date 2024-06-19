import React, { useState } from "react";
import ZoomCCMembers from "./components/ZoomCCMembers";
import "./App.css";
import UpdateCCMembers from "./components/UpdateCCMembers";

export default function App() {
  const [currentMembers, setCurrentMembers] = useState(false);

  return (
    <>
      <h1>On Call Provider Call Queue</h1>
      <UpdateCCMembers setCurrentMembers={setCurrentMembers} />
      <ZoomCCMembers
        currentMembers={currentMembers}
        setCurrentMembers={setCurrentMembers}
      />
    </>
  );
}
