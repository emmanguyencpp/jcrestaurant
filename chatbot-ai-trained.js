// ============================================
// JC RESTAURANT - ADVANCED CHATBOT V2.0
// ============================================

class JCRestaurantChatbot {
    constructor() {
        console.log('🤖 JC Restaurant Chatbot Advanced đang khởi động...');
        this.init();
    }

    init() {
        // Khởi tạo biến
        this.isOpen = false;
        this.isProcessing = false;
        this.conversationHistory = [];
        this.userPreferences = {};
        this.currentIntent = '';
        this.sessionId = this.generateSessionId();
        
        // API Configuration - THAY KEY CỦA BẠN VÀO ĐÂY
        this.API_KEY = 'AIzaSyAyHUhtIXXbg3XSR7Rs2_n8v9waFiqf774';
        this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`;
        
        // DOM Elements
        this.elements = {
            container: document.getElementById('chatbot-container'),
            window: document.getElementById('chatbot-window'),
            btn: document.getElementById('chatbot-btn'),
            closeBtn: document.getElementById('chat-close-btn'),
            messages: document.getElementById('chat-messages'),
            input: document.getElementById('chat-input'),
            sendBtn: document.getElementById('chat-send-btn')
        };
        
        // Knowledge Base từ HTML
        this.knowledgeBase = this.extractKnowledgeFromHTML();
        
        // Khởi tạo
        this.setupEventListeners();
        this.loadFromStorage();
        this.showWelcomeOnFirstVisit();
        
        console.log('✅ Chatbot đã sẵn sàng với Knowledge Base:', this.knowledgeBase);
    }

    extractKnowledgeFromHTML() {
        // Trích xuất thông tin từ HTML
        return {
            restaurant: {
                name: "JC RESTAURANT",
                address: "143 Nguyễn Chính, Hoàng Mai, Hà Nội",
                phone: "0987 724 041",
                email: "jcrestaurant@gmail.com",
                hours: "10:00 - 22:00 hàng ngày",
                social: {
                    facebook: "#",
                    instagram: "#",
                    tiktok: "#",
                    youtube: "#"
                }
            },
            
            menus: {
                // Từ section Menu
                setMenus: {
                    for2: {
                        name: "Menu 2 Người - Lãng Mạn",
                        price: "2.500.000 VNĐ",
                        dishes: [
                            { name: "Súp Kem Hải Sản", price: "1.000.000 VNĐ", desc: "Kem tươi, tôm, mực, nghệ tây" },
                            { name: "Filet Mignon", price: "1.200.000 VNĐ", desc: "Bò Úc, sốt rượu vang đỏ, khoai tây nghiền truffle" },
                            { name: "Set Tiramisu Cao Cấp", price: "300.000 VNĐ", desc: "Bánh tiramisu Ý, cà phê arabica, cacao nguyên chất" }
                        ]
                    },
                    for4: {
                        name: "Menu 4 Người - Gia Đình",
                        price: "4.800.000 VNĐ",
                        dishes: [
                            { name: "Súp Bí Đỏ Kem", price: "1.500.000 VNĐ", desc: "Bí đỏ hữu cơ, kem tươi, hạt bí" },
                            { name: "Gà Nướng Lavender", price: "1.500.000 VNĐ", desc: "Gà ta, sốt lavender, rau củ nướng" },
                            { name: "Set Tráng Miệng 4 Món", price: "1.800.000 VNĐ", desc: "Macaron, chocolate, bánh flan, trái cây" }
                        ]
                    },
                    for6: {
                        name: "Menu 6 Người - Bạn Bè",
                        price: "6.000.000 VNĐ",
                        dishes: [
                            { name: "Súp Hành Pháp", price: "1.000.000 VNĐ", desc: "Hành tây caramel, nước dùng bò, phô mai gruyere" },
                            { name: "Hải Sản Tổng Hợp", price: "2.500.000 VNĐ", desc: "Tôm hùm, sò điệp, mực, sốt beurre blanc" },
                            { name: "Platter Tráng Miệng", price: "2.500.000 VNĐ", desc: "6 món tráng miệng đặc sắc" }
                        ]
                    },
                    for8: {
                        name: "Menu 8 Người - Tiệc Lớn",
                        price: "8.000.000 VNĐ",
                        dishes: [
                            { name: "Set Khai Vị 8 Món", price: "4.000.000 VNĐ", desc: "Các món khai vị đặc sắc châu Âu" },
                            { name: "Bò Tomahawk", price: "2.500.000 VNĐ", desc: "Bò Úc 1.2kg, sốt rượu vang, rau củ nướng" },
                            { name: "Set Tráng Miệng Thịnh Soạn", price: "1.500.000 VNĐ", desc: "8 món tráng miệng tinh tế" }
                        ]
                    }
                },
                
                // Từ section Seasonal
                specialDishes: {
                    seasonal: [
                        { name: "Pizza Hè Tươi Mát", price: "320.000 VNĐ", desc: "Pizza tươi, thịt ba chỉ, phô mai dê, sốt chanh mật ong" },
                        { name: "Mì Ý Tôm Tươi", price: "650.000 VNĐ", desc: "Mì Ý Nauy, tôm sốt xoài nhiệt đới, rau củ nướng" },
                        { name: "Thanh Cua Nướng", price: "700.000 VNĐ", desc: "Thanh cua nướng Nhật Bản, sốt rượu kem, khoai tây truffle" }
                    ],
                    bestseller: [
                        { name: "Pancake Wellington", price: "300.000 VNĐ", desc: "Pancake Wellington sốt thăn bò bọc pate gan, nấm, bánh pastry vàng giòn" },
                        { name: "Cá Hồi Sốt Chanh", price: "720.000 VNĐ", desc: "Cá hồi Nauy áp chảo, sốt chanh dây, măng tây" },
                        { name: "Pasta Hải Sản Ý", price: "180.000 VNĐ", desc: "Pasta tự làm, tôm, mực, nghêu, sốt cà chua tươi" }
                    ],
                    chef: [
                        { name: "Pizza Truffle Đen", price: "850.000 VNĐ", desc: "Pizza với phô mai mozzarella, nấm truffle đen, thịt xông khói" },
                        { name: "Súp Hành Pháp", price: "350.000 VNĐ", desc: "Súp hành tây kiểu Pháp với phô mai gruyere nướng" },
                        { name: "Dessert Platter", price: "650.000 VNĐ", desc: "5 món tráng miệng tinh tế" }
                    ]
                }
            },
            
            // Từ section Booking
            bookingInfo: {
                features: [
                    "Không gian sang trọng, riêng tư",
                    "Thực đơn tùy chỉnh theo yêu cầu",
                    "Setup trang trí theo chủ đề",
                    "Dịch vụ chuyên nghiệp, tận tâm",
                    "Âm nhạc theo yêu cầu"
                ],
                eventTypes: ["Sinh nhật", "Kỷ niệm", "Doanh nghiệp", "Gặp mặt"],
                contact: {
                    phone: "0987 724 041",
                    email: "jcrestaurant@gmail.com"
                }
            },
            
            // Từ section About
            aboutInfo: {
                features: [
                    { title: "Nguyên liệu cao cấp", desc: "Nhập khẩu trực tiếp từ châu Âu" },
                    { title: "Đầu bếp hàng đầu", desc: "Với hơn 15 năm kinh nghiệm" },
                    { title: "Không gian sang trọng", desc: "Thiết kế tân cổ điển châu Âu" }
                ],
                stats: [
                    { number: "5000+", label: "Khách hàng hài lòng" },
                    { number: "50+", label: "Món ăn đặc sắc" },
                    { number: "5", label: "Năm kinh nghiệm" }
                ]
            }
        };
    }

    generateSessionId() {
        return 'jc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setupEventListeners() {
        // Toggle chat
        this.elements.btn.addEventListener('click', () => this.toggleChat());
        this.elements.closeBtn.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.elements.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
        
        // Quick suggestions
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.elements.input.value = question;
                this.handleSendMessage();
            });
        });
        
        // Auto-focus khi mở chat
        this.elements.btn.addEventListener('click', () => {
            setTimeout(() => this.elements.input.focus(), 100);
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.elements.window.classList.add('active');
        this.isOpen = true;
        document.querySelector('.notification-dot').style.display = 'none';
        
        if (this.elements.messages.children.length === 0) {
            this.showWelcomeMessage();
        }
        
        this.scrollToBottom();
    }

    closeChat() {
        this.elements.window.classList.remove('active');
        this.isOpen = false;
    }

    async handleSendMessage() {
        if (this.isProcessing) {
            this.showNotification('Vui lòng chờ phản hồi trước khi gửi tiếp');
            return;
        }
        
        const message = this.elements.input.value.trim();
        if (!message) return;
        
        // Hiển thị tin nhắn người dùng
        this.addUserMessage(message);
        this.elements.input.value = '';
        
        // Hiển thị typing indicator
        const typingId = this.showTypingIndicator();
        
        // Xử lý tin nhắn
        this.isProcessing = true;
        
        try {
            const response = await this.processMessage(message);
            this.removeTypingIndicator(typingId);
            this.addBotMessage(response);
        } catch (error) {
            console.error('Error processing message:', error);
            this.removeTypingIndicator(typingId);
            this.addBotMessage(this.getFallbackResponse(message));
        }
        
        this.isProcessing = false;
        this.scrollToBottom();
    }

    addUserMessage(text) {
        const messageDiv = this.createMessageElement(text, 'user');
        this.elements.messages.appendChild(messageDiv);
        this.saveToHistory(text, 'user');
    }

    addBotMessage(text) {
        const messageDiv = this.createMessageElement(text, 'bot');
        this.elements.messages.appendChild(messageDiv);
        this.saveToHistory(text, 'bot');
        
        // Hiển thị quick replies nếu cần
        this.showQuickRepliesBasedOnContext(text);
    }

    createMessageElement(text, type) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        
        const time = new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const formattedText = this.formatMessage(text);
        
        div.innerHTML = `
            <div class="message-text">${formattedText}</div>
            <div class="message-time">${time}</div>
        `;
        
        return div;
    }

    formatMessage(text) {
        // Chuyển URL thành link
        let formatted = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener">$1</a>'
        );
        
        // Chuyển số điện thoại thành link
        formatted = formatted.replace(
            /(\+?[0-9\s\-\(\)]{10,})/g,
            '<a href="tel:$1">$1</a>'
        );
        
        // Chuyển email thành link
        formatted = formatted.replace(
            /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
            '<a href="mailto:$1">$1</a>'
        );
        
        // Giữ nguyên line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Định dạng bullet points
        formatted = formatted.replace(/•/g, '<br>• ');
        
        return formatted;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.id = 'typing-' + Date.now();
        
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="typing-text">Trợ lý AI đang trả lời...</div>
        `;
        
        this.elements.messages.appendChild(typingDiv);
        return typingDiv.id;
    }

    removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    async processMessage(userMessage) {
        // Phát hiện intent
        this.currentIntent = this.detectIntent(userMessage);
        
        // Kiểm tra xem có trong knowledge base không
        const kbResponse = this.getKnowledgeBaseResponse(userMessage, this.currentIntent);
        if (kbResponse) {
            return kbResponse;
        }
        
        // Nếu không có trong KB, gọi API Gemini
        return await this.callGeminiAPI(userMessage);
    }

    detectIntent(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('chào') || msg.includes('hello') || msg.includes('hi')) {
            return 'greeting';
        }
        if (msg.includes('menu') || msg.includes('thực đơn') || msg.includes('giá')) {
            return 'menu';
        }
        if (msg.includes('đặt bàn') || msg.includes('booking') || msg.includes('đặt chỗ')) {
            return 'booking';
        }
        if (msg.includes('địa chỉ') || msg.includes('ở đâu') || msg.includes('location')) {
            return 'location';
        }
        if (msg.includes('giờ mở cửa') || msg.includes('mấy giờ')) {
            return 'hours';
        }
        if (msg.includes('liên hệ') || msg.includes('số điện thoại') || msg.includes('phone')) {
            return 'contact';
        }
        if (msg.includes('tiệc') || msg.includes('sinh nhật') || msg.includes('kỷ niệm')) {
            return 'events';
        }
        if (msg.includes('đặc biệt') || msg.includes('best seller') || msg.includes('nên ăn')) {
            return 'recommendations';
        }
        
        return 'general';
    }

    getKnowledgeBaseResponse(userMessage, intent) {
        const msg = userMessage.toLowerCase();
        
        switch(intent) {
            case 'greeting':
                return `👋 **Xin chào quý khách!**\n\nChào mừng đến với **JC RESTAURANT** - nhà hàng đồ Âu cao cấp tại Hà Nội!\n\nTôi là trợ lý AI của nhà hàng. Tôi có thể giúp quý khách:\n• 🍽️ Xem thực đơn & giá cả\n• 📅 Đặt bàn trực tuyến\n• 📍 Tìm hiểu về nhà hàng\n• 🎉 Tư vấn setup tiệc\n\nQuý khách cần hỗ trợ gì ạ?`;
            
            case 'menu':
                if (msg.includes('2 người') || msg.includes('hai người')) {
                    return this.generateMenuResponse('for2');
                }
                if (msg.includes('4 người') || msg.includes('bốn người')) {
                    return this.generateMenuResponse('for4');
                }
                if (msg.includes('6 người') || msg.includes('sáu người')) {
                    return this.generateMenuResponse('for6');
                }
                if (msg.includes('8 người') || msg.includes('tám người')) {
                    return this.generateMenuResponse('for8');
                }
                return `🍽️ **THỰC ĐƠN JC RESTAURANT**\n\nChúng tôi có các set menu theo số người:\n\n• **2 Người** (Lãng mạn): 2.500.000 VNĐ\n• **4 Người** (Gia đình): 4.800.000 VNĐ\n• **6 Người** (Bạn bè): 6.000.000 VNĐ\n• **8 Người** (Tiệc lớn): 8.000.000 VNĐ\n\n🎯 **Món đặc biệt theo mùa:**\n• Pizza Hè Tươi Mát: 320.000 VNĐ\n• Mì Ý Tôm Tươi: 650.000 VNĐ\n• Thanh Cua Nướng: 700.000 VNĐ\n\n🔥 **Best Seller:**\n• Pancake Wellington: 300.000 VNĐ\n• Cá Hồi Sốt Chanh: 720.000 VNĐ\n• Pasta Hải Sản: 180.000 VNĐ\n\nQuý khách muốn xem chi tiết menu nào?`;
            
            case 'booking':
                return `📅 **ĐẶT BÀN JC RESTAURANT**\n\nChúng tôi sẵn sàng setup tiệc theo yêu cầu:\n\n✅ **Dịch vụ có sẵn:**\n• Không gian sang trọng, riêng tư\n• Thực đơn tùy chỉnh\n• Trang trí theo chủ đề\n• Âm nhạc theo yêu cầu\n\n🎉 **Loại tiệc phục vụ:**\n• Sinh nhật\n• Kỷ niệm\n• Doanh nghiệp\n• Gặp mặt\n\n📞 **Liên hệ đặt tiệc:**\n• Hotline: 0987 724 041\n• Email: jcrestaurant@gmail.com\n\nQuý khách muốn đặt bàn cho bao nhiêu người và vào khi nào?`;
            
            case 'location':
                return `📍 **ĐỊA CHỈ JC RESTAURANT**\n\n🏢 **Địa chỉ:** 143 Nguyễn Chính, Hoàng Mai, Hà Nội\n📱 **Hotline:** 0987 724 041\n📧 **Email:** jcrestaurant@gmail.com\n\n🕐 **GIỜ MỞ CỬA:**\n• Thứ 2 - Chủ nhật: 10:00 - 22:00\n• Mở cửa cả ngày lễ\n\n🚗 **TIỆN ÍCH:**\n• Có chỗ đỗ xe\n• Gần trạm xe buýt\n• Thân thiện người khuyết tật\n\n🎯 Quý khách cần chỉ đường chi tiết không?`;
            
            case 'hours':
                return `🕐 **GIỜ MỞ CỬA JC RESTAURANT**\n\n⏰ **Hàng ngày:** 10:00 - 22:00\n📅 **Tất cả các ngày trong tuần**\n🎉 **Mở cửa cả ngày lễ**\n\n💡 **Lưu ý:**\n• Khuyến khích đặt bàn trước, đặc biệt cuối tuần\n• Nhận đặt tiệc từ 8:00 - 21:00\n• Hotline hỗ trợ: 8:00 - 22:00 hàng ngày\n\nQuý khách muốn đặt bàn vào khung giờ nào?`;
            
            case 'contact':
                return `📞 **LIÊN HỆ JC RESTAURANT**\n\n**Thông tin liên hệ:**\n• Hotline: 0987 724 041 (8:00 - 22:00)\n• Email: jcrestaurant@gmail.com\n• Địa chỉ: 143 Nguyễn Chính, Hoàng Mai, Hà Nội\n\n**Kết nối mạng xã hội:**\n• Facebook: JC RESTAURANT\n• Instagram: @jcrestaurant\n• TikTok: @jcrestaurant\n• YouTube: JC RESTAURANT Channel\n\n**Hỗ trợ khách hàng:**\n• Phản hồi trong 24h\n• Tư vấn miễn phí\n• Đặt bàn 24/7 qua website\n\nQuý khách cần hỗ trợ gì cụ thể ạ?`;
            
            case 'events':
                return `🎉 **TIỆC & SỰ KIỆN TẠI JC RESTAURANT**\n\nChúng tôi chuyên setup tiệc theo yêu cầu:\n\n🎂 **TIỆC SINH NHẬT:**\n• Trang trí bàn theo chủ đề\n• Bánh sinh nhật đặc biệt\n• Quà tặng bất ngờ\n• Nhân viên hát chúc mừng\n\n💖 **KỶ NIỆM:**\n• Hoa tươi lãng mạn\n• Rượu vang cao cấp\n• Set menu đặc biệt\n• Ảnh kỷ niệm chuyên nghiệp\n\n💼 **DOANH NGHIỆP:**\n• Phòng họp riêng\n• Projector & WiFi\n• Set coffee break\n• Menu business lunch\n\n🎯 Quý khách muốn tổ chức sự kiện gì?`;
        }
        
        return null;
    }

    generateMenuResponse(menuKey) {
        const menu = this.knowledgeBase.menus.setMenus[menuKey];
        let response = `🍽️ **${menu.name}**\n💰 **Giá: ${menu.price}**\n\n📋 **Bao gồm:**\n`;
        
        menu.dishes.forEach(dish => {
            response += `\n• **${dish.name}** - ${dish.price}\n  ${dish.desc}`;
        });
        
        response += `\n\n🎯 **Tổng giá trị: ${menu.price}**\n✅ Đã bao gồm VAT và phí phục vụ\n\nQuý khách có muốn đặt menu này không?`;
        
        return response;
    }

    async callGeminiAPI(userMessage) {
        try {
            const context = this.buildContextForAPI(userMessage);
            
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: context }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return this.getFallbackResponse(userMessage);
            }
            
        } catch (error) {
            console.error('Gemini API Error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    buildContextForAPI(userMessage) {
        return `Bạn là trợ lý AI chuyên nghiệp của JC RESTAURANT - nhà hàng đồ Âu cao cấp tại Hà Nội.

THÔNG TIN NHÀ HÀNG:
• Tên: JC RESTAURANT
• Địa chỉ: 143 Nguyễn Chính, Hoàng Mai, Hà Nội
• Hotline: 0987 724 041
• Email: jcrestaurant@gmail.com
• Giờ mở cửa: 10:00 - 22:00 hàng ngày

THỰC ĐƠN CHÍNH (Set Menu):
• 2 Người: 2.500.000 VNĐ (3 món)
• 4 Người: 4.800.000 VNĐ (3 món)
• 6 Người: 6.000.000 VNĐ (3 món)
• 8 Người: 8.000.000 VNĐ (3 món)

MÓN ĐẶC BIỆT:
• Pizza Hè Tươi Mát: 320.000 VNĐ
• Cá Hồi Sốt Chanh: 720.000 VNĐ
• Pasta Hải Sản: 180.000 VNĐ
• Pancake Wellington: 300.000 VNĐ

YÊU CẦU TRẢ LỜI:
1. Luôn bằng tiếng Việt, tự nhiên, thân thiện
2. Gọi khách hàng là "quý khách"
3. Trả lời ngắn gọn nhưng đầy đủ thông tin
4. Luôn mời gọi đặt bàn hoặc hỏi thêm
5. Không nói "xin lỗi" nếu không biết, thay vào đó chuyển hướng sang dịch vụ khác

Câu hỏi của khách hàng: "${userMessage}"

Trả lời:`;
    }

    getFallbackResponse(userMessage) {
        return `Cảm ơn quý khách đã quan tâm đến JC RESTAURANT!

Về câu hỏi "${userMessage}", tôi có thể cung cấp thông tin về:

🍽️ **THỰC ĐƠN & GIÁ CẢ:**
• Set menu 2-8 người
• Món đặc biệt theo mùa
• Best seller của nhà hàng

📅 **ĐẶT BÀN & TIỆC:**
• Đặt bàn online/hotline
• Setup tiệc sinh nhật, kỷ niệm
• Phòng riêng cho doanh nghiệp

📍 **THÔNG TIN KHÁC:**
• Địa chỉ: 143 Nguyễn Chính, HN
• Hotline: 0987 724 041
• Giờ mở cửa: 10:00-22:00

Hoặc quý khách có thể:
📞 Gọi trực tiếp: 0987 724 041
📧 Email: jcrestaurant@gmail.com
🌐 Truy cập website để biết thêm chi tiết

Quý khách muốn biết thêm về mục nào?`;
    }

    showWelcomeMessage() {
        const welcomeMessage = `👑 **CHÀO MỪNG ĐẾN VỚI JC RESTAURANT!** 👑

🎉 **Nhà hàng đồ Âu cao cấp hàng đầu Hà Nội**

🌟 **ĐIỂM NỔI BẬT:**
• Nguyên liệu nhập khẩu từ châu Âu
• Đầu bếp với 15+ năm kinh nghiệm
• Không gian sang trọng tân cổ điển
• Dịch vụ 5 sao chuyên nghiệp

🤖 **TÔI CÓ THỂ GIÚP QUÝ KHÁCH:**
1. 🍽️ Xem thực đơn & giá cả
2. 📅 Đặt bàn trực tuyến
3. 📍 Chỉ đường đến nhà hàng
4. 🎉 Tư vấn setup tiệc
5. ❓ Giải đáp mọi thắc mắc

💬 Quý khách cần hỗ trợ gì ạ?`;

        setTimeout(() => {
            this.addBotMessage(welcomeMessage);
            this.showQuickReplies('welcome');
        }, 500);
    }

    showQuickRepliesBasedOnContext(lastMessage) {
        const msg = lastMessage.toLowerCase();
        
        if (msg.includes('menu') || msg.includes('thực đơn')) {
            this.showQuickReplies('menu');
        } else if (msg.includes('đặt bàn') || msg.includes('booking')) {
            this.showQuickReplies('booking');
        } else if (msg.includes('địa chỉ') || msg.includes('location')) {
            this.showQuickReplies('location');
        } else {
            this.showQuickReplies('general');
        }
    }

    showQuickReplies(type) {
        // Xóa quick replies cũ
        const oldContainer = this.elements.messages.querySelector('.quick-reply-container');
        if (oldContainer) oldContainer.remove();
        
        let quickReplies = [];
        
        switch(type) {
            case 'welcome':
                quickReplies = [
                    { text: '🍽️ Xem menu 2 người', action: 'show_menu_2' },
                    { text: '📅 Đặt bàn ngay', action: 'start_booking' },
                    { text: '📍 Địa chỉ nhà hàng', action: 'show_location' },
                    { text: '🎉 Tiệc sinh nhật', action: 'birthday_party' }
                ];
                break;
                
            case 'menu':
                quickReplies = [
                    { text: '👫 Menu 2 người', action: 'show_menu_2' },
                    { text: '👨‍👩‍👧‍👦 Menu 4 người', action: 'show_menu_4' },
                    { text: '👯 Menu 6 người', action: 'show_menu_6' },
                    { text: '🎊 Menu 8 người', action: 'show_menu_8' },
                    { text: '🔥 Món đặc biệt', action: 'show_special_dishes' }
                ];
                break;
                
            case 'booking':
                quickReplies = [
                    { text: '🗓️ Đặt hôm nay', action: 'book_today' },
                    { text: '🎂 Tiệc sinh nhật', action: 'birthday_party' },
                    { text: '💼 Doanh nghiệp', action: 'business_event' },
                    { text: '💖 Kỷ niệm', action: 'anniversary_event' }
                ];
                break;
                
            default:
                quickReplies = [
                    { text: '🍽️ Thực đơn', action: 'show_menu' },
                    { text: '📞 Liên hệ', action: 'show_contact' },
                    { text: '🕐 Giờ mở cửa', action: 'show_hours' },
                    { text: '📍 Chỉ đường', action: 'show_directions' }
                ];
        }
        
        const container = document.createElement('div');
        container.className = 'quick-reply-container';
        
        quickReplies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply.text;
            button.addEventListener('click', () => this.handleQuickReply(reply.action));
            container.appendChild(button);
        });
        
        this.elements.messages.appendChild(container);
        this.scrollToBottom();
    }

    handleQuickReply(action) {
        let response = '';
        
        switch(action) {
            case 'show_menu_2':
                response = this.generateMenuResponse('for2');
                break;
            case 'show_menu_4':
                response = this.generateMenuResponse('for4');
                break;
            case 'show_menu_6':
                response = this.generateMenuResponse('for6');
                break;
            case 'show_menu_8':
                response = this.generateMenuResponse('for8');
                break;
            case 'show_special_dishes':
                response = `🔥 **MÓN ĐẶC BIỆT THEO MÙA**\n\n`;
                this.knowledgeBase.menus.specialDishes.seasonal.forEach(dish => {
                    response += `• **${dish.name}** - ${dish.price}\n  ${dish.desc}\n\n`;
                });
                response += `🎯 Quý khách muốn thử món nào?`;
                break;
            case 'start_booking':
                response = `📅 **BẮT ĐẦU ĐẶT BÀN**\n\nVui lòng cho tôi biết:\n1. Ngày đặt (dd/mm/yyyy)\n2. Giờ (ví dụ: 19:00)\n3. Số người\n4. Dịp đặc biệt (nếu có)\n\nHoặc gọi ngay: 0987 724 041`;
                break;
            case 'show_location':
                response = this.getKnowledgeBaseResponse('địa chỉ', 'location');
                break;
            case 'show_hours':
                response = this.getKnowledgeBaseResponse('giờ mở cửa', 'hours');
                break;
            case 'show_contact':
                response = this.getKnowledgeBaseResponse('liên hệ', 'contact');
                break;
        }
        
        if (response) {
            this.addBotMessage(response);
            this.showQuickReplies(action);
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }, 100);
    }

    showNotification(message) {
        // Tạo notification tạm thời
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: #c19a6b;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    saveToHistory(text, type) {
        this.conversationHistory.push({
            text: text,
            type: type,
            time: new Date().toISOString(),
            intent: this.currentIntent
        });
        
        // Giữ lại 20 tin nhắn gần nhất
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
        
        this.saveToStorage();
    }

    saveToStorage() {
        try {
            localStorage.setItem('jcChatHistory', JSON.stringify(this.conversationHistory));
            localStorage.setItem('jcUserPreferences', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.warn('Không thể lưu dữ liệu:', error);
        }
    }

    loadFromStorage() {
        try {
            const savedHistory = localStorage.getItem('jcChatHistory');
            if (savedHistory) {
                this.conversationHistory = JSON.parse(savedHistory);
                // Hiển thị lịch sử
                this.displayHistory();
            }
        } catch (error) {
            console.warn('Không thể load dữ liệu:', error);
        }
    }

    displayHistory() {
        this.conversationHistory.forEach(msg => {
            if (msg.type === 'user') {
                this.addUserMessage(msg.text);
            } else {
                this.addBotMessage(msg.text);
            }
        });
    }

    showWelcomeOnFirstVisit() {
        if (!localStorage.getItem('jcChatFirstVisit')) {
            setTimeout(() => {
                if (!this.isOpen) {
                    this.openChat();
                }
                localStorage.setItem('jcChatFirstVisit', 'true');
            }, 3000);
        }
    }
}

// Khởi tạo chatbot khi trang web tải xong
document.addEventListener('DOMContentLoaded', function() {
    window.jcChatbot = new JCRestaurantChatbot();
});