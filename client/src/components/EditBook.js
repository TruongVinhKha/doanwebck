import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import { useAuth } from '../components/AuthContext';
import API_URL from '../config';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [book, setBook] = useState({
    id: "",
    title: "",
    author: "",
    publishedDate: "",
    category: "",
    price: "",
    coverImage: "",
    description: "",
    status: "còn hàng"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu sách từ API
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        // Use the correct endpoint that matches your server.js
        const response = await axios.get(`${API_URL}/books/${id}`);
        const bookData = response.data;

        // Format the date if it exists
        if (bookData.publishedDate) {
          const date = new Date(bookData.publishedDate);
          bookData.publishedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }

        setBook(bookData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${API_URL}/books/${id}`,
        book,
        {
          headers: {
            'Authorization': `Bearer ${token}`
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
              <Form.Label className="fw-semibold">URL Hình ảnh</Form.Label>
              <Form.Control
                type="text"
                name="coverImage"
                value={book.coverImage}
                onChange={handleChange}
                placeholder="Nhập URL hình ảnh"
                required
              />
            </Form.Group>
            {book.coverImage && (
              <div className="image-preview mb-3">
                <Image
                  src={book.coverImage || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'}
                  alt="Preview"
                  fluid
                  style={{ maxHeight: "200px" }}
                  onError={(e) => {
                    e.target.src = 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
                  }}
                />
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