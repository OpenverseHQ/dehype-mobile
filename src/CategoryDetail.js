import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function CategoryDetail() {
  const { state } = useLocation();
  const { category } = state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  const [newName, setNewName] = useState(category?.name || "");
  const [newImage, setNewImage] = useState(category?.coverUrl || "https://via.placeholder.com/300");
  const [authToken, setAuthToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZhbiBkYXQgNSIsIndhbGxldEFkZHJlc3MiOiIxMjM0MSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMzE5MzkxNSwiZXhwIjoxNzMzMzY2NzE1fQ.JRaipZNRiWJ9sThj8YuE1-TyAndBsinX-wqfdA7aXOs"
  );

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
  const handleImageURL = (e) => {
    if (typeof e === 'string') return e;
    const file = e ;
    if (file) {
      // Tạo URL tạm thời cho ảnh đã chọn để hiển thị
      const imageUrl = URL.createObjectURL(file);
      return imageUrl; 
    }
    return file;
  };

  return (
    <body id="BG">
    <div className="container my-4">
      <h1 className="text-center mb-4 text-white">Category Detail</h1>

      <button className="btn btn-primary mb-3" onClick={() => navigate("/")}>
        Back
      </button>

      {/* Update Name Section */}
      <div className="card shadow-sm mb-4 my-card">
        <div className="card-body">
          <h2 className="card-title">Update Name</h2>
          <div className="mb-3">
            <input
              type="text" 
              className="form-control bg-dark text-white"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <button className="btn btn-success" onClick={handleUpdateName}>
            Update Name
          </button>
        </div>
      </div>

      {/* Update Image Section */}
      <div className="card shadow-sm my-card">
        <div className="card-body">
          <h2 className="card-title">Update Image</h2>
          {newImage && (
            <div className="text-center mb-3 ">
              <img
                src={handleImageURL(newImage)}
                alt="Category"
                className="img-fluid rounded"
                style={{ maxWidth: "300px" }}
              />
            </div>
          )}
          <div className="mb-3">
            <input
              type="file"
              className="form-control bg-dark text-white"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </div>
          <button className="btn btn-success" onClick={handleUpdateImage}>
            Update Image
          </button>
        </div>
      </div>
    </div>
    </body>
  );
}

export default CategoryDetail;
