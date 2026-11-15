/**
 * Tuyển tập Tóm tắt Tác phẩm & Giá trị Văn học cho các tác phẩm kinh điển hàng đầu
 * Đảm bảo hiển thị văn phong biên tập sang trọng, sâu sắc thay cho các chuỗi mặc định kỹ thuật.
 */

export const BOOK_DESCRIPTIONS: Record<number, string> = {
  // 16. The Girl with the Dragon Tattoo - Stieg Larsson
  16: "The Girl with the Dragon Tattoo (Cô Gái Có Hình Xăm Rồng) mở đầu bằng vụ mất tích đầy uẩn khúc của thiếu nữ Harriet Vanger suốt bốn mươi năm trên hòn đảo thuộc quyền sở hữu của một gia tộc công nghiệp Thụy Điển danh giá nhưng mục ruỗng từ bên trong. Nhà báo tài ba Mikael Blomkvist cùng nữ hacker thiên tài Lisbeth Salander – người sở hữu trí tuệ sắc bén, tính cách lập dị cùng hình xăm rồng trên lưng – đã dấn thân vào cuộc điều tra nghẹt thở, từng bước phơi bày những tội ác tăm tối và mạng lưới quyền lực ngầm của giới thượng lưu Bắc Âu.",

  // 1. The Hunger Games - Suzanne Collins
  1: "Lấy bối cảnh quốc gia Panem hậu tận thế trỗi dậy từ đống tro tàn của Bắc Mỹ, Đấu Trường Sinh Tử là giải đấu tàn khốc thường niên do Capitol độc tài tổ chức, buộc 24 thanh thiếu niên từ 12 quận phải chém giết nhau để tranh quyền sống sót duy nhất trên sóng truyền hình trực tiếp. Khi tình nguyện thế chỗ em gái mình, Katniss Everdeen đã bước vào một cuộc chiến sinh tử không chỉ vì mạng sống cá nhân, mà còn thắp lên ngọn lửa phản kháng dữ dội chống lại ách cai trị bạo tàn.",

  // 2. Harry Potter and the Sorcerer's Stone - J.K. Rowling
  2: "Harry Potter and the Sorcerer's Stone mở ra cánh cửa dẫn lối độc giả vào Thế giới Phù thủy diệu kỳ thông qua cuộc đời của cậu bé mồ côi Harry Potter. Sống trong tủ gầm cầu thang tăm tối dưới sự hắt hủi của gia đình dì dượng Dursley, cuộc đời Harry hoàn toàn rẽ sang trang mới vào sinh nhật 11 tuổi khi nhận được thư nhập học từ Học viện Ma thuật và Pháp thuật Hogwarts. Tại đây, cùng với hai người bạn thân Ron Weasley và Hermione Granger, Harry bắt đầu khám phá chân tướng về cái chết của cha mẹ và đối mặt với thế lực hắc ám của Kẻ-Mà-Ai-Cũng-Biết-Là-Ai-Đó.",

  // 3. Twilight - Stephenie Meyer
  3: "Chuyển đến thị trấn Forks mù sương và ẩm ướt ở bang Washington, cô nữ sinh Bella Swan không ngờ cuộc sống trầm lặng của mình lại bị đảo lộn hoàn toàn khi gặp gỡ Edward Cullen – một chàng trai mang vẻ đẹp mê hoặc, bí ẩn và sở hữu sức mạnh phi thường. Khi khám phá ra Edward cùng gia đình anh là những ma cà rồng ăn chay, Bella đã bước vào một mối tình lãng mạn đầy nguy hiểm, nơi lằn ranh giữa khao khát tình yêu và bản năng săn mồi bị thử thách đến tột cùng.",

  // 4. To Kill a Mockingbird - Harper Lee
  4: "Lấy bối cảnh thị trấn miền Nam nước Mỹ Maycomb nghèo khó giữa thời kỳ Đại suy thoái, Giết Con Chim Nhại là khúc ca nhân văn bất hủ về lương tri và sự công chính qua góc nhìn trong trẻo của cô bé Scout Finch. Cha cô, luật sư Atticus Finch, dũng cảm nhận lời bào chữa cho Tom Robinson – một người đàn ông da đen vô tội bị vu cáo cưỡng hiếp một phụ nữ da trắng, bất chấp làn sóng định kiến và kỳ thị chủng tộc gay gắt từ cộng đồng.",

  // 5. The Great Gatsby - F. Scott Fitzgerald
  5: "Đặt trong Kỷ nguyên Jazz hào nhoáng và trụy lạc của nước Mỹ thập niên 1920, Gatsby Vĩ Đại kể về cuộc đời bi tráng của Jay Gatsby – một triệu phú bí ẩn luôn tổ chức những bữa tiệc xa hoa thâu đêm suốt sáng tại dinh thự Long Island chỉ để mong đợi một cái nhìn từ Daisy Buchanan, người con gái anh yêu say đắm thời trai trẻ. Tác phẩm phơi bày sự rạn nứt sâu sắc của Giấc mơ Mỹ đằng sau lớp vỏ bọc phù phiếm của tiền bạc và địa vị.",

  // 6. The Fault in Our Stars - John Green
  6: "Khi Lỗi Thuộc Về Những Vì Sao là câu chuyện lay động hàng triệu trái tim về Hazel Grace Lancaster – cô gái 16 tuổi mắc bệnh ung thư tuyến giáp giai đoạn cuối, và Augustus Waters – chàng trai quyến rũ từng sống sót sau căn bệnh ung thư xương. Cuộc gặp gỡ định mệnh tại nhóm hỗ trợ bệnh nhân ung thư đã nhen nhóm giữa họ một tình yêu nồng nàn, sâu sắc và đầy nghị lực, dạy cho nhau cách trân trọng từng khoảnh khắc hữu hạn của cuộc đời.",

  // 7. The Hobbit - J.R.R. Tolkien
  7: "The Hobbit là thiên sử thi mở đầu cho thế giới Trung Địa huyền thoại của J.R.R. Tolkien. Câu chuyện dõi theo Bilbo Baggins – một người Hobbit hiền lành, yêu thích cuộc sống yên bình tại vùng Shire – bị cuốn vào một cuộc phiêu lưu nguy hiểm cùng pháp sư Gandalf và mười ba người lùn do Thorin Oakenshield dẫn đầu, nhằm đòi lại Vương quốc Dưới Núi Erebor và kho báu tổ tiên bị con rồng hung bạo Smaug chiếm giữ.",

  // 8. The Catcher in the Rye - J.D. Salinger
  8: "Bắt Trẻ Đồng Xanh khắc họa chân dung bất hủ của Holden Caulfield – một thiếu niên 16 tuổi vừa bị đuổi học khỏi trường nội trú Pencey Prep. Lang thang suốt ba ngày cô đơn giữa thành phố New York mùa đông, Holden lên tiếng phê phán sự giả tạo, đạo đức giả của thế giới người lớn và ôm ấp ước mơ thuần khiết trở thành người đứng trên bờ vực của cánh đồng lúa mạch, dang tay bắt giữ những đứa trẻ đang mải mê chơi đùa không để chúng trượt chân ngã xuống vực thẳm.",

  // 9. Angels & Demons - Dan Brown
  9: "Mở màn bằng vụ sát hại tàn bạo một nhà vật lý hạt nhân tại trung tâm CERN và sự biến mất của mẫu phản vật chất hủy diệt, Thiên Thần & Ác Quỷ đưa giáo sư biểu tượng học Robert Langdon vào một cuộc chạy đua nghẹt thở chống lại hội kín Illuminati. Giữa lòng thành phố Rome cổ kính và Tòa thánh Vatican trong thời khắc bầu chọn Giáo hoàng mới, Langdon phải giải mã mật mã bốn nguyên tố để ngăn chặn âm mưu hủy diệt tàn bạo.",

  // 10. Pride and Prejudice - Jane Austen
  10: "Kiêu Hãnh và Định Kiến là kiệt tác châm biếm xã hội và lãng mạn kinh điển của Jane Austen. Xoay quanh mối quan hệ đầy trắc trở giữa Elizabeth Bennet thông minh, cá tính và Fitzwilliam Darcy giàu có nhưng kiêu kỳ, tác phẩm bóc trần những định kiến giai cấp và áp lực hôn nhân vụ lợi thời kỳ Nhiếp chính tại Anh, đồng thời tôn vinh giá trị của tình yêu chân thành bắt nguồn từ sự thấu hiểu và tôn trọng lẫn nhau.",

  // 11. The Kite Runner - Khaled Hosseini
  11: "Người Đua Diều là câu chuyện đầy day dứt về tình bạn, sự phản bội và hành trình chuộc lại lỗi lầm giữa Amir – con trai một thương gia giàu có ở Kabul – và Hassan – cậu bé người hầu trung thành xuất thân từ sắc tộc Hazara bị kỳ thị. Trải qua những thăng trầm của lịch sử Afghanistan từ thời kỳ quân chủ yên bình đến cuộc chiến tranh tàn khốc dưới ách cai trị Taliban, tác phẩm là khúc tráng ca xúc động về tình cha con và sức mạnh cứu rỗi của lương tâm.",

  // 13. 1984 - George Orwell
  13: "1984 là kiệt tác văn học phản địa đàng (Dystopia) vĩ đại nhất thế kỷ 20 của George Orwell. Lấy bối cảnh siêu quốc gia Oceania dưới ách cai trị toàn trị của Đại Huynh (Big Brother), nơi mọi suy nghĩ, hành động và cảm xúc của con người đều bị giám sát 24/7 qua màn hình vô tuyến Tele-screen và cảnh sát tư tưởng. Nhân vật chính Winston Smith âm thầm nuôi dưỡng sự nổi loạn nhằm tìm lại tự do và sự thật lịch sử đã bị bóp méo tàn nhẫn.",

  // 14. Animal Farm - George Orwell
  14: "Chuyện Ở Nông Trại là ngụ ngôn chính trị sắc sảo của George Orwell về sự biến chất của lý tưởng cách mạng. Đàn súc vật tại Trang viên Manor do hai chú lợn Snowball và Napoleon lãnh đạo đã vùng lên lật đổ người chủ say xỉn Jones để thiết lập chế độ bình đẳng. Tuy nhiên, quyền lực tha hóa dần biến loài lợn trở thành những kẻ độc tài áp bức mới, với khẩu hiệu cay đắng: 'Mọi con vật đều bình đẳng, nhưng một số con vật bình đẳng hơn những con vật khác'.",

  // 18. Harry Potter and the Prisoner of Azkaban - J.K. Rowling
  18: "Năm học thứ ba tại Hogwarts của Harry Potter bị bao phủ bởi bầu không khí ảm đạm và nguy hiểm khi Sirius Black – tử tù khét tiếng đào tẩu khỏi ngục Azkaban – được cho là đang săn lùng Harry để trả thù cho Chúa tể Voldemort. Cùng với sự hiện diện rùng rợn của các Giám ngục Azkaban và chiếc Bản Đồ Đạo Tặc bí mật, Harry khám phá ra những bí mật chấn động về tình bạn của thế hệ cha mình và sự thật đằng sau vụ phản bội lịch sử.",

  // 26. The Da Vinci Code - Dan Brown
  26: "Mật Mã Da Vinci bắt đầu bằng vụ án mạng bí ẩn của người phụ trách bảo tàng Louvre Jacques Saunière, người để lại những ký hiệu kỳ lạ được viết bằng chính máu của mình. Giáo sư Robert Langdon cùng nhà mật mã học Sophie Neveu bị cuốn vào cuộc rượt đuổi nghẹt thở khắp Paris và London, giải mã những thông điệp ẩn giấu trong các kiệt tác hội họa của Leonardo da Vinci để tìm kiếm Chén Thánh và bí mật có thể làm rung chuyển nền tảng của Kitô giáo.",

  // 28. Lord of the Flies - William Golding
  28: "Chúa Ruồi của nhà văn đoạt giải Nobel William Golding kể về một nhóm nam sinh người Anh bị mắc kẹt trên một hoang đảo nhiệt đới hoang sơ sau một vụ tai nạn máy bay thời chiến. Từ những nỗ lực ban đầu nhằm thiết lập một xã hội dân chủ trật tự, nỗi sợ hãi về 'quái vật' vô hình và bản năng sinh tồn hoang dã đã dần xé nát nhóm bạn, biến họ thành những bộ lạc man rợ và phơi bày bản chất tàn bạo nguyên thủy của con người.",

  // 30. Gone Girl - Gillian Flynn
  30: "Cô Gái Mất Tích là đỉnh cao của thể loại giật gân tâm lý hiện đại. Vào đúng kỷ niệm 5 năm ngày cưới, Amy Dunne đột ngột biến mất khỏi ngôi nhà ở Missouri, để lại hiện trường với nhiều dấu hiệu bạo lực. Chồng cô, Nick Dunne, nhanh chóng trở thành nghi can số một dưới áp lực nghẹt thở của truyền thông và cảnh sát. Nhưng đằng sau vỏ bọc một cuộc hôn nhân hoàn hảo là một trò chơi tâm lý thao túng tinh vi, quỷ quyệt và tàn nhẫn.",

  // 62. The Golden Compass - Philip Pullman
  62: "Chiếc La Bàn Vàng đưa độc giả vào một thế giới song song kỳ thú nơi linh hồn con người tồn tại bên ngoài cơ thể dưới hình dạng những con thú hộ mệnh gọi là Dæmon. Cô bé mồ côi dũng cảm Lyra Belacqua bắt đầu chuyến hành trình nguy hiểm lên phương Bắc băng giá để giải cứu người bạn thân bị bắt cóc bởi những kẻ săn trẻ em bí ẩn, mang theo Chiếc La Bàn Vàng Alethiometer – báu vật duy nhất có thể chỉ ra sự thật tuyệt đối.",

  // 200. And Then There Were None - Agatha Christie
  200: "Mười Người Da Đen Nhỏ là đỉnh cao trinh thám phá án không thể xô đổ của Nữ hoàng Trinh thám Agatha Christie. Mười người xa lạ không quen biết được một chủ nhà bí ẩn mời đến hòn đảo biệt lập Soldier Island ngoài khơi Devon. Bị cô lập hoàn toàn giữa bão tố biển khơi, từng người lần lượt bị sát hại theo từng câu vần của một bài đồng dao trẻ em cổ xưa, phơi bày những tội ác chưa từng bị trừng phạt trong quá khứ của mỗi nạn nhân.",

  // 514. The Adventures of Sherlock Holmes - Arthur Conan Doyle
  514: "Những Cuộc Phiêu Lưu Của Sherlock Holmes tập hợp 12 vụ án kinh điển nhất ghi dấu tài năng suy luận logic và phương pháp quan sát siêu phàm của thám tử vĩ đại Sherlock Holmes cùng bác sĩ John Watson tại phố Baker. Từ vụ tống tiền tinh vi của Hoàng gia Bohemia đến bí ẩn hội Tóc Đỏ, mỗi câu chuyện là một màn đấu trí cân não đỉnh cao của nghệ thuật phá án hình sự."
};
