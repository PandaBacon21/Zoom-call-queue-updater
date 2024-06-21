import React, { useState } from "react";
import ZoomCCMembers from "./components/ZoomCCMembers";
import "./App.css";
import UpdateCCMembers from "./components/UpdateCCMembers";
import { Paper, Typography } from "@mui/material";

export default function App() {
  const [currentMembers, setCurrentMembers] = useState(false);

  return (
    <Paper elevation={6} sx={{ m: 8, p: 4 }}>
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        Call Queue Picker
      </Typography>
      <UpdateCCMembers setCurrentMembers={setCurrentMembers} />
      <ZoomCCMembers
        currentMembers={currentMembers}
        setCurrentMembers={setCurrentMembers}
      />
    </Paper>
  );
}
