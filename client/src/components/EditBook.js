import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Image } from "react-bootstrap";
import axios from "axios";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    id: "",
    title: "",
    category: "",
    price: "",
    status: "còn hàng",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu sách từ API
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        // Use the correct endpoint that matches your server.js
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        const bookData = response.data;
        
        // Format the date if it exists
        if (bookData.publishedDate) {
          const date = new Date(bookData.publishedDate);
          bookData.publishedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
        
        setBook(bookData);
        // Set image preview if it exists
        setImagePreview(bookData.coverImage?.startsWith('http') 
          ? bookData.coverImage 
          : `http://localhost:5000${bookData.coverImage}`);
          
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book:", error);
        showNotification("Không thể tải thông tin sách!", "error");
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && value < 0) {
      showNotification("Giá không thể là số âm!", "error");
      return;
    }
    setBook({ ...book, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      
      // Loại bỏ các trường null/undefined và chuyển đổi giá trị thành string
      Object.keys(book).forEach((key) => {
        if (book[key] != null) {
          formData.append(key, String(book[key]));
        }
      });
      
      if (imageFile) {
        formData.append("coverImage", imageFile);
      }
  
      const response = await axios.put(
        `http://localhost:5000/books/${id}`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.status === 200) {
        showNotification("Cập nhật sách thành công!");
        navigate("/book-list");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      showNotification(
        error.response?.data?.message || "Lỗi khi cập nhật sách!", 
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `notification ${type}`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h3>Đang tải thông tin sách...</h3>
        </div>
      </Container>
    );
  }

  return (
    <>
      <style>
        {`
          .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            color: white;
          }

          .notification.success {
            background-color: #28a745;
          }

          .notification.error {
            background-color: #dc3545;
          }

          .image-preview {
            text-align: center;
          }
        `}
      </style>
      <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="w-100" style={{ maxWidth: "600px" }}>
          <h1 className="text-center fs-4 fw-bold text-danger mb-4">Chỉnh Sửa Sách</h1>
          <Form
            onSubmit={handleSubmit}
            className="p-4 shadow rounded-4 border-0 d-flex flex-column gap-3"
            style={{ backgroundColor: "#fffaf9" }}
          >
            <Form.Group>
              <Form.Label className="fw-semibold">ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={book.id || ''}
                readOnly
                className="bg-light"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={book.title || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Thể loại</Form.Label>
              <Form.Select
                name="category"
                value={book.category || ''}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn thể loại --</option>
                <option value="Khoa học">Khoa học</option>
                <option value="Tiểu thuyết">Tiểu thuyết</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Lịch sử">Lịch sử</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={book.price || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Trạng thái</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Còn hàng"
                  name="status"
                  value="còn hàng"
                  checked={book.status === "còn hàng"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Hết hàng"
                  name="status"
                  value="hết hàng"
                  checked={book.status === "hết hàng"}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={book.description || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Hình ảnh</Form.Label>
              <Form.Control
                type="file"
                name="coverImage"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Chỉ chọn ảnh mới nếu bạn muốn thay đổi ảnh hiện tại
              </Form.Text>
            </Form.Group>
            {imagePreview && (
              <div className="image-preview mb-3">
                <Image src={imagePreview} alt="Preview" fluid style={{ maxHeight: "200px" }} />
              </div>
            )}
            <div className="d-flex justify-content-between mt-3 gap-2">
              <Button
                variant="danger"
                type="submit"
                className="w-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Cập nhật sách"}
              </Button>
              <Link to="/book-list" className="w-50">
                <Button variant="outline-secondary" className="w-100">
                  Quay về
                </Button>
              </Link>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default EditBook;