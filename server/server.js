const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bookstore_jwt_secret';

// Middleware CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://client-gamma-inky.vercel.app']
        : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://truongvinhkha:kha123@books-data.uqjrvey.mongodb.net/?retryWrites=true&w=majority&appName=Books-data';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const bookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    category: { type: String, default: 'Unknown' },
    price: { type: Number, default: 0 },
    coverImage: { type: String, default: 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg' },
    description: { type: String, default: '' },
    status: { type: String, default: 'còn hàng' }
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

const Book = mongoose.model('Book', bookSchema);
const User = mongoose.model('User', userSchema);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có token xác thực' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ' });
        }
        req.user = user;
        next();
    });
};

// Register API
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Đăng ký thành công',
            user: { id: user._id, username, email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Login API
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập không tồn tại' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Đăng nhập thành công',
            user: { id: user._id, username, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Get Current User API
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Get Book Count API
app.get('/api/books/count', async (req, res) => {
    try {
        const count = await Book.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Add Book API
app.post('/books', authenticateToken, async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Books List API (with pagination)
app.get('/books', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments();

        res.json({
            books,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBooks: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Book API
app.put('/books/:id', authenticateToken, async (req, res) => {
    try {
        const updatedBook = await Book.findOneAndUpdate(
            { $or: [{ _id: req.params.id }, { id: req.params.id }] },
            req.body,
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Book Detail API
app.get('/books/:id', async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);
        if (!book) {
            book = await Book.findOne({ id: req.params.id });
        }

        if (!book) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Book API
app.delete('/books/:id', authenticateToken, async (req, res) => {
    try {
        const deletedBook = await Book.findOneAndDelete({
            $or: [{ _id: req.params.id }, { id: req.params.id }]
        });

        if (!deletedBook) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        res.json({ message: 'Xóa sách thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Book Store API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Đã xảy ra lỗi!', error: err.message });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});