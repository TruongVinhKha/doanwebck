const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Đảm bảo khớp với URL của React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Phục vụ file tĩnh

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage });

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB connection
const mongoURI = 'mongodb+srv://truongvinhkha:kha123@books-data.uqjrvey.mongodb.net/?retryWrites=true&w=majority&appName=Books-data';
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Thoát nếu không kết nối được
  });

// Định nghĩa schema
const bookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Thêm trường id
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  category: { type: String, default: 'Unknown' },
  price: { type: Number, default: 0 },
  coverImage: { type: String, default: 'default.jpg' },
  description: { type: String, default: '' },
  status: { type: String, default: 'còn hàng' } // Thêm trường status
});

const Book = mongoose.model('Book', bookSchema);

// Endpoint để lấy số lượng sách
app.get('/api/books/count', async (req, res) => {
  try {
    const count = await Book.countDocuments();
    console.log(`Fetched book count: ${count}`); // Logging để debug
    res.json({ count });
  } catch (error) {
    console.error('Error fetching book count:', error);
    res.status(500).json({ error: 'Error fetching book count' });
  }
});

// Endpoint để thêm sách
app.post('/books', upload.single('coverImage'), async (req, res) => {
  const { id, title, author, publishedDate, category, price, description, status } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : 'default.jpg';

  try {
    const newBook = new Book({
      id, // Lưu id từ client
      title,
      author,
      publishedDate,
      category,
      price: parseFloat(price), // Chuyển price thành số
      coverImage,
      description,
      status
    });
    await newBook.save();
    console.log(`Added new book with ID: ${id}`);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(400).json({ message: error.message });
  }
});

// Lấy danh sách sách (phân trang)
app.get('/books', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật sách
app.put('/books/:id', upload.single('coverImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.coverImage = '/uploads/' + req.file.filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật sách' });
  }
});

// Add this to your server.js file
app.get('/books/:id', async (req, res) => {
  try {
    // Try finding by MongoDB _id first
    let book = await Book.findById(req.params.id);
    
    // If not found, try finding by custom id field
    if (!book) {
      book = await Book.findOne({ id: req.params.id });
    }
    
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: error.message });
  }
});
// Xóa sách
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route mặc định
app.get('/', (req, res) => {
  res.send('Welcome to the Books API!');
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});