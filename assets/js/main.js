/**
 * BOWNOW - MARKETING AUTOMATION SYSTEM
 * File: main.js
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. LUCIDE ICON ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. GOOGLE APPS SCRIPT ---
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydZqanXFkAiA5mVaxgsbON-mTEsrxCqShFynIx7Ab4bN8epaD9GtWu4fUI6_Rcn2u4/exec";

    // --- 3. MODAL ---
    const modal = document.getElementById('contact-modal');
    const modalSuccess = document.getElementById('form-success');
    const footerSuccess = document.getElementById('footer-form-success');

    window.openModal = function() {
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function() {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            if (modalSuccess) modalSuccess.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }

    // --- 4. SWIPER ---
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

        caseSwiper.on('slideChangeTransitionStart', function() {

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

        item.addEventListener('toggle', function() {

            if (item.open) {

                faqItems.forEach(other => {

                    if (other !== item) {
                        other.removeAttribute('open');
                    }

                });

            }

        });

    });

    // --- 6. FORM SUBMIT ---
    const allForms = document.querySelectorAll('form');

    allForms.forEach(form => {

        form.addEventListener('submit', function(e) {

            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            const originalText = submitBtn.innerHTML;

            const fullName = form.querySelector('input[placeholder*="Họ và tên"]')?.value || "";
            const phone = form.querySelector('input[placeholder*="Số điện thoại"]')?.value || "";
            const email = form.querySelector('input[placeholder*="Email"]')?.value || "";
            const company = form.querySelector('input[placeholder*="Công ty"], input[placeholder*="doanh nghiệp"]')?.value || "";
            const service = form.querySelector('select')?.value || "Tư vấn tổng thể";

            const formData = new URLSearchParams();

            formData.append('fullName', fullName);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('company', company);
            formData.append('service', service);

            submitBtn.disabled = true;

            submitBtn.innerHTML = `
                <span class="flex items-center justify-center gap-2 italic">
                    <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    </svg>
                    Đang gửi...
                </span>
            `;

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            })
            .then(() => {

                if (form.id === 'lead-form' && modalSuccess) {

                    modalSuccess.classList.remove('hidden');

                } else if (footerSuccess) {

                    footerSuccess.classList.remove('hidden');

                }

                form.reset();

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

            })
            .catch(() => {

                submitBtn.disabled = false;
                submitBtn.innerHTML = "Lỗi! Thử lại";

            });

        });

    });

});