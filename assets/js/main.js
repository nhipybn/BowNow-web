/**
 * BOWNOW - MARKETING AUTOMATION SYSTEM
 * File: main.js
 * Chức năng: Quản lý Icon, Modal, Swiper, FAQ và Đồng bộ dữ liệu Google Sheets
 */

/**
 * BOWNOW - MARKETING AUTOMATION SYSTEM
 * File: main.js
 * Chức năng: Quản lý Icon, Modal, Swiper, FAQ và Đồng bộ dữ liệu Google Sheets
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. KHỞI TẠO BIỂU TƯỢNG (LUCIDE ICONS) ---
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // --- 2. CẤU HÌNH GOOGLE APPS SCRIPT (MÃ ID MỚI NHẤT) ---
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzr8AEbSg3AGROp4zWWultCrl8npT7JJEW8GeVsRdgL0PgNBThvD8GGbS3TFx91-fU2/exec"; 

    // --- 3. QUẢN LÝ MODAL (MỞ/ĐÓNG FORM) ---
    const modal = document.getElementById('contact-modal');
    const modalSuccess = document.getElementById('form-success');
    const footerSuccess = document.getElementById('footer-form-success');

    // Hàm mở Modal toàn cục (sẵn sàng để gọi từ thuộc tính onclick trong HTML)
    window.openModal = function() {
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden'; // Khóa cuộn trang
        }
    };

    // Hàm đóng Modal toàn cục
    window.closeModal = function() {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            if (modalSuccess) modalSuccess.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Mở lại cuộn trang
        }
    };

    // Đóng modal khi click ra ngoài vùng form trắng
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // --- 4. KHỞI TẠO SWIPER (DÀNH CHO CASE STUDIES) ---
    if (document.querySelector('.case-swiper')) {
        const caseSwiper = new Swiper('.case-swiper', {
            slidesPerView: 1,
            spaceBetween: 80,
            loop: true,
            speed: 1200,
            autoplay: { delay: 6000, disableOnInteraction: false },
            navigation: { nextEl: '.swiper-next-btn', prevEl: '.swiper-prev-btn' },
            pagination: { el: '.swiper-pagination', clickable: true },
            effect: 'creative',
            creativeEffect: {
                prev: { shadow: true, translate: ['-20%', 0, -1] },
                next: { translate: ['100%', 0, 0] },
            },
        });

        // Reset animation biểu đồ khi chuyển slide
        caseSwiper.on('slideChangeTransitionStart', function () {
            document.querySelectorAll('.animate-bar').forEach(bar => {
                bar.style.animation = 'none';
                bar.offsetHeight; // trigger reflow
                bar.style.animation = null;
            });
        });
    }

    // --- 5. LOGIC FAQ (ACCORDION) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.removeAttribute('open');
                });
            }
        });
    });

    // --- 6. XỬ LÝ GỬI DỮ LIỆU FORM (TỐI ƯU CHO GOOGLE SHEETS) ---
    const allForms = document.querySelectorAll('form');
    
    allForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.innerHTML;

            // Thu thập dữ liệu từ các input dựa trên placeholder
            const fullName = form.querySelector('input[placeholder*="Họ và tên"]')?.value || "";
            const phone = form.querySelector('input[placeholder*="Số điện thoại"]')?.value || "";
            const email = form.querySelector('input[placeholder*="Email"]')?.value || "";
            const company = form.querySelector('input[placeholder*="Công ty"], input[placeholder*="doanh nghiệp"]')?.value || "";
            const service = form.querySelector('select')?.value || "Tư vấn tổng thể";

            // Chuyển đổi dữ liệu sang định dạng URLSearchParams (Tương thích tốt nhất với Apps Script)
            const formData = new URLSearchParams();
            formData.append('fullName', fullName);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('company', company);
            formData.append('service', service);

            // Hiệu ứng Loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="flex items-center justify-center gap-2 italic">
                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đồng bộ...
                </span>
            `;

            // Gửi dữ liệu đi bằng Fetch API
            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Rất quan trọng: Bắt buộc cho Apps Script
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            })
            .then(() => {
                // Xử lý thành công (Mặc định là thành công vì no-cors không đọc được response)
                if ((form.id === 'lead-form' || form.id === 'contact-form') && modalSuccess) {
                    modalSuccess.classList.remove('hidden');
                } else if (footerSuccess) {
                    footerSuccess.classList.remove('hidden');
                    footerSuccess.classList.add('animate-in', 'fade-in', 'zoom-in', 'duration-500');
                }
                
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                console.log('Dữ liệu đã được gửi đi thành công.');
            })
            .catch(error => {
                console.error('Lỗi gửi Form:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Lỗi! Vui lòng thử lại";
            });
        });
    });
});

    // --- 4. KHỞI TẠO SWIPER ---
    if (document.querySelector('.case-swiper')) {

        const caseSwiper = new Swiper('.case-swiper', {
            slidesPerView: 1,
            spaceBetween: 80,
            loop: true,
            speed: 1200,

            autoplay: {
                delay: 6000,
                disableOnInteraction: false
            },

            navigation: {
                nextEl: '.swiper-next-btn',
                prevEl: '.swiper-prev-btn'
            },

            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },

            effect: 'creative',

            creativeEffect: {
                prev: {
                    shadow: true,
                    translate: ['-20%', 0, -1]
                },
                next: {
                    translate: ['100%', 0, 0]
                }
            }
        });

        caseSwiper.on('slideChangeTransitionStart', function () {

            document.querySelectorAll('.animate-bar').forEach(bar => {

                bar.style.animation = 'none';
                bar.offsetHeight;
                bar.style.animation = null;

            });

        });

    }


    // --- 5. FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {

        item.addEventListener('toggle', () => {

            if (item.open) {

                faqItems.forEach(other => {

                    if (other !== item) {
                        other.removeAttribute('open');
                    }

                });

            }

        });

    });


  