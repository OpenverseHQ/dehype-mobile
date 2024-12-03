import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./App.css";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [authToken, setAuthToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZhbiBkYXQgNSIsIndhbGxldEFkZHJlc3MiOiIxMjM0MSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMzE5MzkxNSwiZXhwIjoxNzMzMzY2NzE1fQ.JRaipZNRiWJ9sThj8YuE1-TyAndBsinX-wqfdA7aXOs"
  ); // Thay đổi giá trị token

  const navigate = useNavigate(); // Khởi tạo navigate

  // Gọi API để lấy danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://dehype.api.openverse.tech/api/v1/category"
        );
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch categories!");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Xử lý tạo category mới
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    if (!newCategoryImage) {
      alert("Please upload an image for the category!");
      return;
    }

    try {
      // Tạo FormData và thêm các giá trị
      const formData = new FormData();
      formData.append("name", newCategoryName);
      formData.append("file", newCategoryImage); // 'file' là key được yêu cầu trong API

      const response = await axios.post(
        "https://dehype.api.openverse.tech/api/v1/category",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Thêm category mới vào danh sách
      setCategories([...categories, response.data]);
      setNewCategoryName(""); // Reset input
      setNewCategoryImage(null); // Reset file input
      alert("Category created successfully!");
    } catch (err) {
      alert("Failed to create category. Please check your token or try again.");
    }
  };

  // Xử lý xóa category
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(
        `https://dehype.api.openverse.tech/api/v1/category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Xóa category khỏi danh sách
      setCategories(categories.filter((category) => category.id !== id));
      alert("Category deleted successfully!");
    } catch (err) {
      alert("Failed to delete category. Please check your token or try again.");
    }
  };

  // Điều hướng đến trang CategoryDetail khi click vào category
  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`, { state: { category } }); // Điều hướng tới trang chi tiết của category
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <body id="BG">
    <div className="container">
      <h1 className="text-center my-4 text-white">Category List</h1>
      
      {/* Form tạo category mới */}
      <div className="card mt-4 p-4 mb-3 my-card">
        <h2>Create New Category</h2>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Enter category name"
            className="form-control bg-dark text-white"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            className="form-control bg-dark text-white"
            onChange={(e) => setNewCategoryImage(e.target.files[0])}
          />
        </div>
        <button className="btn btn-primary" onClick={handleCreateCategory}>
          Create
        </button>
      </div>

      {/* Danh sách category */}
      <div className="row">
        {categories.map((category) => (
          <div key={category.id} className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 my-card">
              <img
                src={category.coverUrl}
                alt={category.name}
                className="card-img-top category-image"
                onClick={() => handleCategoryClick(category)} // Thêm sự kiện click
              />
              <div className="card-body">
                <h5 className="card-title">{category.name}</h5>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
    </body>
  );
}

export default CategoryList;
