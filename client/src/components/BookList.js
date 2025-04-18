import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

function BookList({ query, setQuery, category, setCategory }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  // Hàm lấy sách từ API
  const fetchBooks = async (pageNum = 1, append = false) => {
    try {
      const response = await axios.get(`http://localhost:5000/books?page=${pageNum}&limit=10`);
      const newBooks = response.data;
      setItems(prev => append ? [...prev, ...newBooks] : newBooks);
      setHasMore(newBooks.length === 10); // Nếu trả về ít hơn 10, không còn dữ liệu
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Gọi API khi component mount hoặc khi page thay đổi
  useEffect(() => {
    fetchBooks(1);
  }, []);

  // Hàm tải thêm dữ liệu cho InfiniteScroll
  const fetchMoreData = () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(nextPage, true);
  };

  // Xóa sách
  const handleDelete = (id) => {
    setDeleteBookId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/books/${deleteBookId}`);
      setItems(items.filter((book) => book._id !== deleteBookId));
      setShowDeleteModal(false);
      alert("Sách đã được xóa thành công!");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Có lỗi xảy ra khi xóa sách.");
    }
  };

  // Lọc sách theo query và category
  const filteredBooks = items.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase()) &&
    (category === "" || category === "Tất cả" || book.category === category)
  );

  return (
    <Container>
      {/* Search bar */}
      <div className="d-flex align-items-center mb-4">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm sách..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="me-2 flex-grow-1"
        />
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-grow-1"
        >
          <option value="">Tất cả</option>
          {[...new Set(items.map((book) => book.category))].map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </Form.Select>
      </div>

      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p style={{ textAlign: "center" }}><b>Đang tải...</b></p>}
        endMessage={<p style={{ textAlign: "center" }}><b>Bạn đã xem hết rồi!</b></p>}
      >
        <Row className="g-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Col key={book._id} md={3}>
                <Card className="shadow-lg border-0 rounded-4" style={{ backgroundColor: "#fffaf9" }}>
                  <Card.Img
                    src={book.coverImage?.startsWith('http') 
                      ? book.coverImage 
                      : `http://localhost:5000${book.coverImage}`}
                    alt={book.title}
                    className="w-100 object-cover rounded-top-4"
                    style={{ height: "240px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column gap-2">
                    <Card.Title className="line-clamp-2 fw-bold text-dark" style={{ height: "3rem" }}>
                      {book.title}
                    </Card.Title>
                    <Card.Text className="mb-1"><strong>Thể loại:</strong> {book.category}</Card.Text>
                    <Card.Text className="mb-3"><strong>Giá:</strong> {book.price?.toLocaleString()} VND</Card.Text>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => navigate(`/book/${book._id}`)}
                      className="w-100"
                    >
                      Xem chi tiết
                    </Button>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="info"
                        size="sm"
                        as={Link}
                        to={`/edit-book/${book._id}`}
                        className="w-50 me-2"
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(book._id)}
                        className="w-50"
                      >
                        Xóa
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>Không có sách nào phù hợp.</p>
          )}
        </Row>
      </InfiniteScroll>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa Sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa sách này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Quay về</Button>
          <Button variant="danger" onClick={confirmDelete}>Xóa</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default BookList;