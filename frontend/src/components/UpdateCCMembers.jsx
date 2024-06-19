import React, { useState } from "react";
import axios from "axios";
import ListZoomUsers from "./ListZoomUsers";

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
      <ListZoomUsers
        setSelectedUsername={setSelectedUsername}
        setSelectedEmail={setSelectedEmail}
        setSelectedId={setSelectedId}
      />
      {selectedUsername ? (
        <button type="button" className="btn" onClick={handleUpdateCCMembers}>
          Add Call Queue Member
        </button>
      ) : null}
    </>
  );
}
