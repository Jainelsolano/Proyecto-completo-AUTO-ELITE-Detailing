// Punto de entrada principal
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar módulo de reservas
    BookingModule.init();
    
    // ========== MENÚ HAMBURGUESA ==========
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    function openMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openMenu);
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMenu();
        });
    }
    
    // ========== BOTONES DE LOGIN ==========
    const loginBtnDesktop = document.getElementById('loginBtnDesktop');
    const loginBtnMobile = document.getElementById('loginBtnMobile');
    
    if (loginBtnDesktop) {
        loginBtnDesktop.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
    
    if (loginBtnMobile) {
        loginBtnMobile.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
    
    // ========== BOTONES DE AGENDAR ==========
    const bookBtns = document.querySelectorAll('#bookingBtnNav, #bookingBtnMobile, #heroBookBtn');
    bookBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const bookingSection = document.getElementById('citas-section');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                closeMenu();
            });
        }
    });
});