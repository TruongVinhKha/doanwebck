const books = [
    {
        id: "B001",
        coverImage: "B001.jpg",
        title: "To Kill a Mockingbird",
        category: "Tiểu thuyết",
        price: 120000,
        status: "Còn hàng",
        description: "Một câu chuyện đầy ý nghĩa về công lý và đạo đức ở miền Nam nước Mỹ."
    },
    {
        id: "B002",
        coverImage: "B002.jpg",
        title: "1984",
        category: "Tiểu thuyết",
        price: 95000,
        status: "Hết hàng",
        description: "Tác phẩm kinh điển của George Orwell về một xã hội toàn trị."
    },
    {
        id: "B003",
        coverImage: "B003.jpg",
        title: "The Great Gatsby",
        category: "Tiểu thuyết",
        price: 105000,
        status: "Còn hàng",
        description: "Cuốn sách nổi tiếng mô tả xã hội Mỹ những năm 1920 đầy hào nhoáng và bi kịch."
    },
    {
        id: "B004",
        coverImage: "B004.jpg",
        title: "Pride and Prejudice",
        category: "Tiểu thuyết",
        price: 115000,
        status: "Còn hàng",
        description: "Một câu chuyện tình yêu kinh điển với những bài học về lòng kiêu hãnh và định kiến."
    },
    {
        id: "B005",
        coverImage: "B005.jpg",
        title: "Moby Dick",
        category: "Tiểu thuyết",
        price: 130000,
        status: "Hết hàng",
        description: "Câu chuyện về hành trình săn lùng cá voi trắng nổi tiếng của thuyền trưởng Ahab."
    },
    {
        id: "B006",
        coverImage: "B006.jpg",
        title: "13 Nguyên Tắc Nghĩ Giàu Làm Giàu",
        category: "Kinh doanh",
        price: 140000,
        status: "Còn hàng",
        description: "Cuốn sách kinh điển của Napoleon Hill giúp bạn đạt được thành công và thịnh vượng."
    },
    {
        id: "B007",
        coverImage: "B007.jpg",
        title: "Bí Mật Tư Duy Triệu Phú",
        category: "Kinh doanh",
        price: 125000,
        status: "Hết hàng",
        description: "T. Harv Eker chia sẻ bí quyết tư duy của người giàu, giúp bạn thay đổi cách nhìn về tiền bạc."
    },
    {
        id: "B008",
        coverImage: "B008.jpg",
        title: "Quốc Gia Khởi Nghiệp",
        category: "Kinh doanh",
        price: 150000,
        status: "Hết hàng",
        description: "Khám phá bí quyết thành công của Israel, quốc gia dẫn đầu về công nghệ và khởi nghiệp."
    },
    {
        id: "B009",
        coverImage: "B009.jpg",
        title: "Nhà Đầu Tư Thông Minh",
        category: "Kinh doanh",
        price: 160000,
        status: "Còn hàng",
        description: "Benjamin Graham chia sẻ nguyên tắc đầu tư an toàn và hiệu quả."
    },
    {
        id: "B010",
        coverImage: "B010.jpg",
        title: "Bí Quyết Gây Dựng Cơ Nghiệp Bạc Tỷ",
        category: "Kinh doanh",
        price: 135000,
        status: "Hết hàng",
        description: "Adam Khoo chia sẻ chiến lược khởi nghiệp từ con số không để đạt thành công."
    },
    {
        id: "B011",
        coverImage: "B011.jpg",
        title: "Excel Ứng Dụng Văn Phòng: Từ Cơ Bản Đến Nâng Cao",
        category: "Công nghệ",
        price: 90000,
        status: "Còn hàng",
        description: "Cuốn sách cung cấp hướng dẫn chi tiết về Excel, từ các thao tác cơ bản đến nâng cao, giúp người đọc giải quyết các vấn đề thường gặp trong công việc văn phòng."
    },
    {
        id: "B012",
        coverImage: "B012.jpg",
        title: "Code Dạo Ký Sự: Lập Trình Viên Đâu Chỉ Biết Code",
        category: "Công nghệ",
        price: 95000,
        status: "Còn hàng",
        description: "Tác giả chia sẻ những câu chuyện và kinh nghiệm thực tế trong lĩnh vực lập trình, giúp người đọc hiểu rõ hơn về nghề nghiệp và cuộc sống của một lập trình viên."
    },
    {
        id: "B013",
        coverImage: "B013.jpg",
        title: "The Industries of the Future (Công Nghiệp Tương Lai)",
        category: "Công nghệ",
        price: 110000,
        status: "Còn hàng",
        description: "Cuốn sách phân tích các ngành công nghiệp sẽ định hình tương lai, như robot, trí tuệ nhân tạo và an ninh mạng, cung cấp cái nhìn sâu sắc về sự phát triển của công nghệ và tác động của nó đến kinh tế và xã hội."
    },
    {
        id: "B014",
        coverImage: "B014.jpg",
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        category: "Công nghệ",
        price: 120000,
        status: "Còn hàng",
        description: "Cuốn sách hướng dẫn cách viết mã sạch, dễ hiểu và bảo trì, đồng thời giới thiệu các nguyên tắc và thực tiễn tốt nhất trong phát triển phần mềm linh hoạt."
    },
    {
        id: "B015",
        coverImage: "B015.jpg",
        title: "Artificial Intelligence: A Modern Approach",
        category: "Công nghệ",
        price: 130000,
        status: "Còn hàng",
        description: "Cuốn sách cung cấp một cái nhìn tổng quan toàn diện về trí tuệ nhân tạo, từ các thuật toán cơ bản đến các ứng dụng thực tiễn trong đời sống và công nghiệp."
    },
    {
        id: "B016",
        coverImage: "B016.jpg",
        title: "Lịch Sử Thế Giới Cận Đại",
        category: "Lịch sử",
        price: 110000,
        status: "Còn hàng",
        description: "Cuốn sách cung cấp cái nhìn toàn cảnh về lịch sử thế giới từ thế kỷ 18 đến đầu thế kỷ 20."
    },
    {
        id: "B017",
        coverImage: "B017.jpg",
        title: "Việt Nam Sử Lược",
        category: "Lịch sử",
        price: 100000,
        status: "Còn hàng",
        description: "Một trong những cuốn sách lịch sử đầu tiên hệ thống lại toàn bộ lịch sử Việt Nam một cách dễ hiểu."
    },
    {
        id: "B018",
        coverImage: "B018.jpg",
        title: "Sự Trỗi Dậy Và Sụp Đổ Của Các Đế Chế",
        category: "Lịch sử",
        price: 115000,
        status: "Hết hàng",
        description: "Khám phá sự hưng thịnh và suy tàn của các đế chế hùng mạnh như La Mã, Ottoman, Mông Cổ,..."
    },
    {
        id: "B019",
        coverImage: "B019.jpg",
        title: "Những Bài Học Từ Lịch Sử",
        category: "Lịch sử",
        price: 125000,
        status: "Còn hàng",
        description: "Cuốn sách tập hợp những bài học sâu sắc từ lịch sử nhân loại, giúp người đọc hiểu rõ hơn về xã hội hiện đại."
    },
    {
        id: "B020",
        coverImage: "B020.jpg",
        title: "Thế Chiến Thứ Hai",
        category: "Lịch sử",
        price: 130000,
        status: "Hết hàng",
        description: "Cuốn sách phân tích chi tiết về diễn biến, nguyên nhân và hậu quả của cuộc Chiến tranh Thế giới Thứ Hai."
    },
    {
        id: "B021",
        coverImage: "B021.jpg",
        title: "Of Mice and Men",
        category: "Tiểu thuyết",
        price: 180000,
        status: "Còn hàng",
        description: "Một câu chuyện đầy cảm động về tình bạn và số phận con người."
    },
    {
        id: "B022",
        coverImage: "B022.jpg",
        title: "Brave New World",
        category: "Tiểu thuyết",
        price: 150000,
        status: "Còn hàng",
        description: "Một tác phẩm khoa học viễn tưởng mang tính triết học sâu sắc."
    },
    {
        id: "B023",
        coverImage: "B023.jpg",
        title: "The Catcher in the Rye",
        category: "Tiểu thuyết",
        price: 200000,
        status: "Hết hàng",
        description: "Một tiểu thuyết kinh điển về tuổi trẻ và sự nổi loạn."
    },
    {
        id: "B024",
        coverImage: "B024.jpg",
        title: "Les Misérables",
        category: "Tiểu thuyết",
        price: 250000,
        status: "Còn hàng",
        description: "Một kiệt tác văn học về lòng nhân ái và công lý."
    },
    {
        id: "B025",
        coverImage: "B025.jpg",
        title: "Anna Karenina",
        category: "Tiểu thuyết",
        price: 220000,
        status: "Còn hàng",
        description: "Câu chuyện tình yêu đầy bi kịch của Anna Karenina."
    },
    {
        id: "B026",
        coverImage: "B026.jpg",
        title: "Zero to One",
        category: "Kinh doanh",
        price: 180000,
        status: "Còn hàng",
        description: "Peter Thiel chia sẻ cách xây dựng công ty đột phá từ con số không."
    },
    {
        id: "B027",
        coverImage: "B027.jpg",
        title: "Rich Dad Poor Dad",
        category: "Kinh doanh",
        price: 170000,
        status: "Hết hàng",
        description: "Những bài học tài chính từ hai người cha với hai tư duy khác biệt."
    },
    {
        id: "B028",
        coverImage: "B028.jpg",
        title: "The Lean Startup",
        category: "Kinh doanh",
        price: 190000,
        status: "Còn hàng",
        description: "Cách xây dựng startup tinh gọn, phát triển nhanh chóng và hiệu quả."
    },
    {
        id: "B029",
        coverImage: "B029.jpg",
        title: "Think and Grow Rich",
        category: "Kinh doanh",
        price: 160000,
        status: "Còn hàng",
        description: "Cuốn sách kinh điển giúp bạn thay đổi tư duy và đạt được thành công tài chính."
    },
    {
        id: "B030",
        coverImage: "B030.jpg",
        title: "Good to Great",
        category: "Kinh doanh",
        price: 210000,
        status: "Còn hàng",
        description: "Những nguyên tắc giúp các công ty chuyển từ tốt đến vĩ đại."
    },
    {
        id: "B031",
        coverImage: "B031.jpg",
        title: "The Pragmatic Programmer",
        category: "Công nghệ",
        price: 210000,
        status: "Hết hàng",
        description: "Một hướng dẫn thiết thực giúp lập trình viên phát triển kỹ năng chuyên nghiệp."
    },
    {
        id: "B032",
        coverImage: "B032.jpg",
        title: "Introduction to Algorithms",
        category: "Công nghệ",
        price: 300000,
        status: "Còn hàng",
        description: "Cuốn sách kinh điển về thuật toán, được sử dụng trong giảng dạy trên toàn thế giới."
    },
    {
        id: "B033",
        coverImage: "B033.jpg",
        title: "Refactoring: Improving the Design of Existing Code",
        category: "Công nghệ",
        price: 250000,
        status: "Còn hàng",
        description: "Hướng dẫn cải thiện chất lượng mã nguồn mà không làm thay đổi chức năng."
    },
    {
        id: "B034",
        coverImage: "B034.jpg",
        title: "You Don't Know JS",
        category: "Công nghệ",
        price: 180000,
        status: "Còn hàng",
        description: "Bộ sách giúp hiểu sâu về JavaScript, từ cơ bản đến nâng cao."
    },
    {
        id: "B035",
        coverImage: "B035.jpg",
        title: "Deep Learning with Python",
        category: "Công nghệ",
        price: 270000,
        status: "Còn hàng",
        description: "Hướng dẫn thực tiễn về deep learning bằng Python và Keras."
    },
    {
        id: "B036",
        coverImage: "B036.jpg",
        title: "Sapiens: Lược Sử Loài Người",
        category: "Lịch sử",
        price: 230000,
        status: "Còn hàng",
        description: "Yuval Noah Harari giải thích lịch sử tiến hóa của loài người theo cách đầy hấp dẫn."
    },
    {
        id: "B037",
        coverImage: "B037.jpg",
        title: "Guns, Germs, and Steel",
        category: "Lịch sử",
        price: 240000,
        status: "Còn hàng",
        description: "Giải thích sự phát triển của các nền văn minh dựa trên địa lý và sinh học."
    },
    {
        id: "B038",
        coverImage: "B038.jpg",
        title: "The Silk Roads: A New History of the World",
        category: "Lịch sử",
        price: 220000,
        status: "Còn hàng",
        description: "Câu chuyện về con đường tơ lụa và vai trò quan trọng của nó trong lịch sử thế giới."
    },
    {
        id: "B039",
        coverImage: "B039.jpg",
        title: "A People's History of the United States",
        category: "Lịch sử",
        price: 260000,
        status: "Còn hàng",
        description: "Một góc nhìn khác về lịch sử Hoa Kỳ từ quan điểm của những người bị áp bức."
    },
    {
        id: "B040",
        coverImage: "B040.jpg",
        title: "The Lessons of History",
        category: "Lịch sử",
        price: 200000,
        status: "Còn hàng",
        description: "Cuốn sách ngắn gọn nhưng đầy súc tích về những bài học quan trọng từ lịch sử nhân loại."
    }
];

export default books;