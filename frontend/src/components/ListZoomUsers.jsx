import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select, InputLabel, MenuItem, FormControl } from "@mui/material";

export default function ListZoomUsers({
  setSelectedEmail,
  setSelectedId,
  setSelectedUsername,
  selectedUsername,
}) {
  const [loading, setLoading] = useState(false);
  const [zoomUsers, setZoomUsers] = useState(false);

  //   Retrieve User List From API
  useEffect(() => {
    setLoading(true);
    const getZoomUsers = async () => {
      try {
        const res = await axios({
          method: "GET",
          url: "/api/list-zoom-users",
        });
        // console.log(res.data.Users);
        setZoomUsers({ currentZoomUsers: res.data.Users });
      } catch (e) {
        setZoomUsers(null);
        console.error(e);
      }
    };
    if (!loading) getZoomUsers();
  }, []);

  const handleSelectUser = (e) => {
    let pickedUser = zoomUsers.currentZoomUsers.find(
      (user) => user.user_name === e.target.value
    );
    console.log("selected user: " + pickedUser.user_name);
    setSelectedUsername(pickedUser.user_name);
    setSelectedEmail(pickedUser.email);
    setSelectedId(pickedUser.user_id);
  };

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="pick-user-label">User</InputLabel>
        <Select
          labelId="pick-user-label"
          id="select-user-id"
          value={selectedUsername ? selectedUsername : ""}
          label="Select a User"
          onChange={handleSelectUser}
        >
          {zoomUsers
            ? zoomUsers.currentZoomUsers.map((user) => (
                <MenuItem key={user.user_id} value={user.user_name}>
                  {user.user_name}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
    </>
  );
}

// <h2>Users On Account</h2>
// <select onChange={handleSelectUser}>
//   <option value="Select a User">Select a User</option>
//   {zoomUsers
//     ? zoomUsers.currentZoomUsers.map((user) => (
//         <option key={user.user_id} value={user.user_name}>
//           {user.user_name}
//         </option>
//       ))
//     : null}
// </select>
