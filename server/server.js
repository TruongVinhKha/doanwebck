const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // Thêm package cho mã hóa mật khẩu
const jwt = require('jsonwebtoken'); // Thêm package cho JWT

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bookstore_jwt_secret'; // Khóa bí mật JWT

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Đảm bảo khớp với URL của React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Thêm Authorization vào allowedHeaders
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

// Định nghĩa schema sách
const bookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  category: { type: String, default: 'Unknown' },
  price: { type: Number, default: 0 },
  coverImage: { type: String, default: '/uploads/default.jpg' },
  description: { type: String, default: '' },
  status: { type: String, default: 'còn hàng' }
});

// Định nghĩa schema người dùng
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);
const User = mongoose.model('User', userSchema);

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Không có token xác thực' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    req.user = user;
    next();
  });
};

// API đăng ký người dùng
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Kiểm tra người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
    }
    
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    
    // Tạo JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' } // Token hết hạn sau 24 giờ
    );
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// API đăng nhập
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Tìm người dùng
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
    }
    
    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
    }
    
    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// API lấy thông tin người dùng hiện tại
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json(user);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

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

// Endpoint để thêm sách (yêu cầu xác thực)
app.post('/books', authenticateToken, upload.single('coverImage'), async (req, res) => {
  // Kiểm tra quyền admin (nếu cần)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
  }

  const { id, title, author, publishedDate, category, price, description, status } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg';

  try {
    const newBook = new Book({
      id,
      title,
      author,
      publishedDate,
      category,
      price: parseFloat(price),
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

// Cập nhật sách (yêu cầu xác thực)
app.put('/books/:id', authenticateToken, upload.single('coverImage'), async (req, res) => {
  // Kiểm tra quyền admin (nếu cần)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
  }

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

// Lấy chi tiết sách theo ID
app.get('/books/:id', async (req, res) => {
  try {
    // Thử tìm theo MongoDB _id trước
    let book = await Book.findById(req.params.id);
    
    // Nếu không tìm thấy, thử tìm theo trường id tùy chỉnh
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

// Xóa sách (yêu cầu xác thực)
app.delete('/books/:id', authenticateToken, async (req, res) => {
  // Kiểm tra quyền admin (nếu cần)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
  }

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