import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

function CategoryDetail() {
  const { id } = useParams();
  const history = useHistory();

  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [authToken, setAuthToken] = useState(""); // Nhập token ở đây

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    try {
      await axios.patch(
        `https://dehype.api.openverse.tech/api/v1/category/${id}`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Name updated successfully!");
    } catch (err) {
      alert("Failed to update name. Please check your token or try again.");
    }
  };

  const handleUpdateImage = async () => {
    if (!newImage) {
      alert("Please select an image file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", newImage);

    try {
      await axios.patch(
        `https://dehype.api.openverse.tech/api/v1/category/${id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image updated successfully!");
    } catch (err) {
      alert("Failed to update image. Please check your token or try again.");
    }
  };

  return (
    <div>
      <h1>Category Detail</h1>
      <button onClick={() => history.push("/")}>Back</button>

      <div>
        <h2>Update Name</h2>
        <input
          type="text"
          placeholder="Enter new name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleUpdateName}>Update Name</button>
      </div>

      <div>
        <h2>Update Image</h2>
        <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
        <button onClick={handleUpdateImage}>Update Image</button>
      </div>

      <div>
        <h3>Enter Authorization Token</h3>
        <input
          type="text"
          placeholder="Enter your token"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
        />
      </div>
    </div>
  );
}

export default CategoryDetail;
