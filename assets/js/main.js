/**
 * BOWNOW - MARKETING AUTOMATION SYSTEM
 * File: main.js
 * Chức năng: Quản lý Icon, Modal, Swiper, FAQ và Đồng bộ dữ liệu Google Sheets
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. KHỞI TẠO BIỂU TƯỢNG (LUCIDE ICONS) ---
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // --- 2. CẤU HÌNH GOOGLE APPS SCRIPT ---
    // URL này nhận dữ liệu và ghi vào Sheet ID: 1IkLeSG7Eo3YbV7tt-wSd0_4FK68-nZWBinpLSgaXLSs
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz0_EIP-C7caQYCyiWuMnbZp5XYtB5W_UOTFwbfjpFXvBRCIsGJSCrbzu7tiW-08dh7/exec"; 

    // --- 3. QUẢN LÝ MODAL (MỞ/ĐÓNG FORM) ---
    const modal = document.getElementById('contact-modal');
    const modalSuccess = document.getElementById('form-success');
    const footerSuccess = document.getElementById('footer-form-success');

    // Hàm mở Modal toàn cục
    window.openModal = function() {
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    };

    // Hàm đóng Modal toàn cục
    window.closeModal = function() {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            if (modalSuccess) modalSuccess.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    // Đóng modal khi click ra ngoài vùng form
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

        // Reset animation cho các thanh biểu đồ khi chuyển slide
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

    // --- 6. XỬ LÝ GỬI DỮ LIỆU FORM (UNIVERSAL HANDLER) ---
    const allForms = document.querySelectorAll('form');
    
    allForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.innerHTML;

            // Thu thập dữ liệu thông minh dựa trên Placeholder của Input
            const formData = {
                fullName: form.querySelector('input[placeholder*="Họ và tên"]')?.value || "",
                phone: form.querySelector('input[placeholder*="Số điện thoại"]')?.value || "",
                email: form.querySelector('input[placeholder*="Email"]')?.value || "",
                company: form.querySelector('input[placeholder*="Công ty"], input[placeholder*="doanh nghiệp"]')?.value || "",
                service: form.querySelector('select')?.value || "Tư vấn tổng thể"
            };

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
                mode: 'no-cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(() => {
                // Hiển thị trạng thái thành công cho từng loại Form
                if (form.getAttribute('id') === 'lead-form' && modalSuccess) {
                    modalSuccess.classList.remove('hidden');
                } else if (footerSuccess) {
                    footerSuccess.classList.remove('hidden');
                    footerSuccess.classList.add('animate-in', 'fade-in', 'zoom-in', 'duration-500');
                }
                
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                console.log('Dữ liệu đã được đẩy về Google Sheets.');
            })
            .catch(error => {
                console.error('Lỗi kết nối:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Lỗi! Thử lại sau";
            });
        });
    });
});