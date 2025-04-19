import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";

export function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setBook(null);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return (
      <Container className="text-center mt-5">
        <h1 className="text-danger">Sách không tồn tại!</h1>
        <Button as={Link} to="/book-list" variant="primary">Quay lại danh sách</Button>
      </Container>
    );
  }

  const imageUrl = book.coverImage?.startsWith('http') ? book.coverImage : `http://localhost:5000${book.coverImage}`;

  return (
    <Container className="mt-5">
      <Row className="align-items-center shadow-lg p-4 rounded-4 mb-4" style={{ backgroundColor: "#fffaf9" }}>
        <Col md={4} className="text-center mb-4 mb-md-0">
          <Card.Img
            src={imageUrl}
            className="w-100 rounded-4 border"
            alt={book.title}
            style={{ objectFit: "cover", maxHeight: "360px" }}
          />
        </Col>
        <Col md={8}>
          <h2 className="mb-4 fw-bold text-dark">{book.title}</h2>
          <p><strong>Thể loại:</strong> {book.category}</p>
          <p><strong>Giá:</strong> {book.price.toLocaleString()} VND</p>
          <p><strong>Trạng thái:</strong> {book.status}</p>
          <p><strong>Mô tả:</strong> {book.description}</p>
        </Col>
      </Row>
      <div className="text-center">
        <Button as={Link} to="/book-list" variant="outline-secondary">
          ← Quay lại danh sách
        </Button>
      </div>
    </Container>
  );
}
