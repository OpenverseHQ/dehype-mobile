import React, { useState, useEffect } from "react";
import axios from "axios";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [authToken, setAuthToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZhbiBkYXQgNSIsIndhbGxldEFkZHJlc3MiOiIxMjM0MSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMzE5MzkxNSwiZXhwIjoxNzMzMzY2NzE1fQ.JRaipZNRiWJ9sThj8YuE1-TyAndBsinX-wqfdA7aXOs"); // Lưu token của người dùng

  // Gọi API để lấy danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://dehype.api.openverse.tech/api/v1/category");
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
      await axios.delete(`https://dehype.api.openverse.tech/api/v1/category/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Xóa category khỏi danh sách
      setCategories(categories.filter((category) => category.id !== id));
      alert("Category deleted successfully!");
    } catch (err) {
      alert("Failed to delete category. Please check your token or try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="App">
      <h1>Category List</h1>
      {/* Danh sách category */}
      <div className="category-container">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <img src={category.coverUrl} alt={category.name} className="category-image" />
            <h2>{category.name}</h2>
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Form tạo category mới */}
      <div className="create-category">
        <h2>Create New Category</h2>
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewCategoryImage(e.target.files[0])}
        />
        <button onClick={handleCreateCategory}>Create</button>
      </div>
    </div>
  );
}

export default CategoryList;
