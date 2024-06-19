import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

export default function ZoomCCMembers({ currentMembers, setCurrentMembers }) {
  const [loading, setLoading] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    setLoading(true);
    const getCCMembers = async () => {
      try {
        const res = await axios({
          method: "GET",
          url: "/api/list-cc-members",
        });
        // console.log(res.data.current_cc_members);
        setCurrentMembers({ currentCCMembers: res.data.current_cc_members });
      } catch (e) {
        setCurrentMembers(null);
        console.error(e);
      }
    };
    if (!loading) getCCMembers();
  }, [currentMembers]);

  const handleRowSelection = async () => {
    // Add function to remove users from Queue
    let usersToRemove = [];
    for (let index = 0; index < rowSelectionModel.length; index++) {
      for (let i = 0; i < currentMembers.currentCCMembers.length; i++) {
        if (
          rowSelectionModel[index] === currentMembers.currentCCMembers[i].id
        ) {
          console.log(
            "Selected User: " + currentMembers.currentCCMembers[i].user_id
          );
          usersToRemove.push(currentMembers.currentCCMembers[i].user_id);
        }
      }
    }
    console.log(usersToRemove);
    try {
      const res = await axios({
        method: "POST",
        url: "/api/remove-cc-members",
        data: {
          Users: usersToRemove,
        },
      });
      console.log(res.data);
      setCurrentMembers({ currentCCMembers: res.data.Users });
      setRowSelectionModel([]);
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    { field: "id", headerName: "Index", width: 200 },
    { field: "name", headerName: "User Name", width: 250 },
    { field: "user_id", headerName: "User ID", width: 250 },
    { field: "receive_call", headerName: "Receive Call Status", width: 250 },
  ];

  return (
    <>
      <h2>Current Call Queue Members:</h2>
      {rowSelectionModel.length > 0 ? (
        <button type="button" className="btn" onClick={handleRowSelection}>
          Remove from Queue
        </button>
      ) : null}
      {currentMembers ? (
        <div style={{ height: 300, width: "100%" }}>
          <DataGrid
            rows={currentMembers.currentCCMembers}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
              console.log(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

// {currentMembers ? (
//   currentMembers.currentCCMembers.map((member) => (
//     <li key={member.user_id}>
//       {member.name}{" "}
//       <button type="button" className="btn">
//         X
//       </button>
//     </li>
//   ))
// ) : (
//   <p>Loading...</p>
// )}
