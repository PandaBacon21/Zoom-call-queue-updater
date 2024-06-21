import React, { useState } from "react";
import axios from "axios";
import ListZoomUsers from "./ListZoomUsers";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function UpdateCCMembers({ setCurrentMembers }) {
  const [selectedUsername, setSelectedUsername] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(false);
  const [selectedId, setSelectedId] = useState(false);

  const updateMembers = async () => {
    try {
      const res = await axios({
        method: "POST",
        url: "/api/update-cc-members",
        data: {
          email: selectedEmail,
          user_id: selectedId,
        },
      });
      console.log(res.data);
      setCurrentMembers({ currentCCMembers: res.data.Users });
      setSelectedUsername(false);
      setSelectedEmail(false);
      setSelectedId(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCCMembers = () => {
    updateMembers();
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Users on Account
      </Typography>
      <div>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <ListZoomUsers
            selectedUsername={selectedUsername}
            setSelectedUsername={setSelectedUsername}
            setSelectedEmail={setSelectedEmail}
            setSelectedId={setSelectedId}
          />
          {selectedUsername ? (
            <Button
              variant="contained"
              size="small"
              onClick={handleUpdateCCMembers}
              sx={{ p: 2 }}
            >
              Add Call Queue Member
            </Button>
          ) : null}
        </Stack>
      </div>
    </>
  );
}
