// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button, Container, Navbar, Nav, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddBook from "./components/AddBook";
import {BookDetail} from "./components/BookDetail";
import EditBook from "./components/EditBook";
import BookList from "./components/BookList";

export function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  return (
    <Router>
      <NavBar query={query} setQuery={setQuery} category={category} setCategory={setCategory} />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-list" element={<BookList query={query} setQuery={setQuery} category={category} setCategory={setCategory} />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/edit-book/:id" element={<EditBook />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">Chào mừng đến với Book Store</h1>
      <p className="mb-4">Khám phá danh sách sách yêu thích của bạn ngay hôm nay!</p>
      <Row className="gap-3 justify-content-center">
        <Button as={Link} to="/book-list" variant="primary">Xem Danh Sách Sách</Button>
        <Button as={Link} to="/add-book" variant="success"> Thêm Sách Mới</Button>
      </Row>
    </Container>
  );
}

export function NavBar() {
  return (
    <Navbar expand="lg" className="shadow-sm py-3" style={{ backgroundColor: "#fef6f6" }}>
      <Container>
      <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
  <img
    src="/images/LogoBooks.jpg"
    alt="Book Store Logo"
    style={{ height: "70px", width: "auto", objectFit: "contain" }}
    className="d-inline-block align-top"
  />
</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
       <Nav className="d-flex align-items-center gap-3">
         <Nav.Link
            as={Link}
           to="/book-list"
            className="text-dark fw-medium nav-link-custom"
          >
           Danh Sách Sản Phẩm
         </Nav.Link>
          <Nav.Link
            as={Link}
            to="/add-book"
           className="text-dark fw-medium nav-link-custom"
         >
           Thêm Sách
          </Nav.Link>
             </Nav>

        <Nav className="ms-auto">
         <Button
            as={Link}
            to="/login"
           variant="outline-danger"
           style={{ transition: "all 0.3s ease" }}
          >
            Đăng Nhập
          </Button>
        </Nav>
      </Navbar.Collapse>


      </Container>
    </Navbar>
  );
}


function NotFound() {
  return (
    <Container className="text-center">
      <h1 className="text-danger">404 - Không tìm thấy trang</h1>
      <Button as={Link} to="/" variant="primary">Về Trang Chủ</Button>
    </Container>
  );
}