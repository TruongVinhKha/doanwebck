import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Image } from "react-bootstrap";
import axios from "axios";

function AddBook() {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    id: "",
    title: "",
    author: "",
    publishedDate: "",
    category: "",
    price: "",
    status: "còn hàng",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [nextId, setNextId] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy số lượng sách từ database để tạo nextId
  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books/count");
        setNextId(response.data.count + 1); // Tăng thêm 1 để tạo ID mới
      } catch (error) {
        console.error("Error fetching book count:", error);
      }
    };
    fetchBookCount();
  }, []);

  // Tạo ID tự động dựa trên category và nextId
  useEffect(() => {
    if (book.category) {
      let categoryCode = "";
      switch (book.category) {
        case "Khoa học":
          categoryCode = "TLKH";
          break;
        case "Tiểu thuyết":
          categoryCode = "TLTT";
          break;
        case "Kinh tế":
          categoryCode = "TLKT";
          break;
        case "Lịch sử":
          categoryCode = "TLLS";
          break;
        default:
          categoryCode = "TLXX";
      }
      const formattedNumber = String(nextId).padStart(4, "0");
      const generatedId = `BOOK${categoryCode}${formattedNumber}`;
      setBook({ ...book, id: generatedId });
    }
  }, [book.category, nextId]);

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
    if (!imageFile) {
      showNotification("Vui lòng chọn một hình ảnh!", "error");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(book).forEach((key) => {
      formData.append(key, book[key]);
    });
    formData.append("coverImage", imageFile);

    try {
      const response = await axios.post("http://localhost:5000/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        showNotification("Thêm sách thành công!");
        setNextId(nextId + 1); // Tăng nextId sau khi thêm thành công
        setBook({
          id: "",
          title: "",
          author: "",
          publishedDate: "",
          category: "",
          price: "",
          status: "còn hàng",
          description: "",
        });
        setImageFile(null);
        setImagePreview("");
        navigate("/book-list");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      showNotification("Có lỗi xảy ra khi thêm sách!", "error");
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
          <h1 className="text-center fs-4 fw-bold text-danger mb-4">Thêm Sách Mới</h1>
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
                value={book.id}
                readOnly
                placeholder="ID tự động"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={book.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Tác giả</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={book.author}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Ngày xuất bản</Form.Label>
              <Form.Control
                type="date"
                name="publishedDate"
                value={book.publishedDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Thể loại</Form.Label>
              <Form.Select
                name="category"
                value={book.category}
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
                value={book.price}
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
                value={book.description}
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
                required
              />
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
                {isSubmitting ? "Đang xử lý..." : "Thêm sách"}
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

export default AddBook;