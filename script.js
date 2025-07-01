// 테마 관리
class ThemeManager {
    constructor() {
        this.themeBtn = document.getElementById('theme-btn');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        const icon = this.themeBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}


// 애니메이션 관리
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupSkillTagAnimations();
        this.setupFloatingShapes();
        this.setupParallaxEffect();
    }

    setupFloatingShapes() {
        // 마우스 움직임에 따른 도형 인터랙션
        const profileSection = document.querySelector('.profile-section');
        const shapes = document.querySelectorAll('.shape');
        
        if (profileSection && shapes.length > 0) {
            profileSection.addEventListener('mousemove', (e) => {
                const rect = profileSection.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                shapes.forEach((shape, index) => {
                    const intensity = (index + 1) * 0.02;
                    const moveX = (x - 0.5) * 50 * intensity;
                    const moveY = (y - 0.5) * 50 * intensity;
                    
                    shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
            
            profileSection.addEventListener('mouseleave', () => {
                shapes.forEach(shape => {
                    shape.style.transform = 'translate(0, 0)';
                });
            });
        }
    }

    setupParallaxEffect() {
        // 미묘한 스크롤 효과 (겹침 방지를 위해 패럴랙스 제거)
        const profileSection = document.querySelector('.profile-section');
        
        if (profileSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const sectionHeight = profileSection.offsetHeight;
                const scrollProgress = Math.min(scrolled / sectionHeight, 1);
                
                // 프로필 섹션이 화면에서 벗어날 때만 미묘한 효과 적용
                if (scrolled > 0) {
                    profileSection.style.opacity = Math.max(1 - scrollProgress * 0.3, 0.7);
                } else {
                    profileSection.style.opacity = 1;
                }
            });
        }
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // 모든 섹션에 스크롤 애니메이션 적용
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('animate-on-scroll');
            observer.observe(section);
        });
    }

    setupHoverEffects() {
        // 프로젝트 카드 호버 효과
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // 소셜 링크 호버 효과
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const icon = e.target.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(10deg) scale(1.2)';
                }
            });
            
            link.addEventListener('mouseleave', (e) => {
                const icon = e.target.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }
            });
        });
    }

    setupSkillTagAnimations() {
        document.querySelectorAll('.skill-tag').forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.1}s`;
            tag.classList.add('skill-tag-animate');
        });
    }
}

// 연락처 관리
class ContactManager {
    constructor() {
        this.setupContactActions();
    }

    setupContactActions() {
        // 이메일 클릭 시 클립보드 복사
        document.querySelectorAll('.contact-item').forEach(item => {
            const text = item.querySelector('span').textContent;
            const icon = item.querySelector('i');
            
            if (icon.classList.contains('fa-envelope')) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    this.copyToClipboard(text, '이메일 주소가 복사되었습니다!');
                });
            } else if (icon.classList.contains('fa-phone')) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    this.copyToClipboard(text, '전화번호가 복사되었습니다!');
                });
            }
        });
    }

    async copyToClipboard(text, message) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(message);
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
            this.showToast('복사에 실패했습니다.', 'error');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// 성능 최적화
class PerformanceOptimizer {
    constructor() {
        this.setupLazyLoading();
        this.optimizeImages();
    }

    setupLazyLoading() {
        // 프로필 이미지 lazy loading
        const profileImg = document.querySelector('.profile-image img');
        if (profileImg) {
            profileImg.loading = 'lazy';
        }
    }

    optimizeImages() {
        // 이미지 로드 최적화
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    }
}

// 접근성 개선
class AccessibilityManager {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // 키보드 네비게이션 개선
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    setupAriaLabels() {
        // ARIA 레이블 추가
        document.querySelectorAll('.social-links a').forEach(link => {
            const text = link.querySelector('span').textContent;
            link.setAttribute('aria-label', `${text} 링크`);
        });

        document.querySelectorAll('.project-links a').forEach(link => {
            const isGithub = link.querySelector('.fa-github');
            const label = isGithub ? 'GitHub 저장소' : '프로젝트 데모';
            link.setAttribute('aria-label', label);
        });
    }

    setupReducedMotion() {
        // 모션 감소 설정 확인 및 적용
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition', 'none');
        }

        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.style.setProperty('--transition', 'none');
            } else {
                document.documentElement.style.setProperty('--transition', 'all 0.3s ease');
            }
        });
    }
}

// 동적 바이너리 생성기
class BinaryGenerator {
    constructor() {
        this.binaryContainer = null;
        this.init();
    }

    init() {
        this.createBinaryElements();
        this.startBinaryGeneration();
    }

    createBinaryElements() {
        const binaryRain = document.querySelector('.binary-rain');
        if (!binaryRain) return;

        // 동적 바이너리 스트림 생성
        for (let i = 0; i < 10; i++) {
            const stream = document.createElement('div');
            stream.className = 'binary-stream';
            stream.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -20px;
                font-family: 'Courier New', monospace;
                font-size: ${8 + Math.random() * 6}px;
                color: rgba(255, 255, 255, ${0.05 + Math.random() * 0.1});
                animation: binaryDrop ${5 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
                z-index: 1;
            `;
            binaryRain.appendChild(stream);
        }
    }

    generateRandomBinary(length = 50) {
        return Array.from({length}, () => Math.random() > 0.5 ? '1' : '0').join('');
    }

    startBinaryGeneration() {
        const streams = document.querySelectorAll('.binary-stream');
        
        streams.forEach((stream, index) => {
            // 각 스트림에 고유한 바이너리 패턴 생성
            const updateBinary = () => {
                stream.textContent = this.generateRandomBinary(30);
                stream.style.left = Math.random() * 100 + '%';
            };
            
            updateBinary();
            
            // 주기적으로 바이너리 업데이트
            setInterval(updateBinary, 3000 + Math.random() * 4000);
        });
    }
}

// 메인 앱 클래스
class NameCardApp {
    constructor() {
        this.init();
    }

    init() {
        // DOM이 로드된 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // 각 컴포넌트 초기화
            this.themeManager = new ThemeManager();
            this.animationManager = new AnimationManager();
            this.contactManager = new ContactManager();
            this.performanceOptimizer = new PerformanceOptimizer();
            this.accessibilityManager = new AccessibilityManager();
            this.binaryGenerator = new BinaryGenerator();

            // 추가 CSS 애니메이션 정의
            this.addCustomStyles();
            
            console.log('명함 사이트가 성공적으로 초기화되었습니다.');
        } catch (error) {
            console.error('초기화 중 오류 발생:', error);
        }
    }

    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }

            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .skill-tag-animate {
                opacity: 0;
                animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .keyboard-nav *:focus {
                outline: 2px solid var(--primary-color) !important;
                outline-offset: 2px !important;
            }

            img.loaded {
                opacity: 1;
                transition: opacity 0.3s ease;
            }

            /* 플랫 디자인 추가 애니메이션 */
            .contact-item, .social-links a, .project-card {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .skill-tag {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* 호버 상태 개선 */
            .project-card:hover {
                animation: flatCardHover 0.3s ease forwards;
            }

            @keyframes flatCardHover {
                to {
                    transform: translateY(-5px);
                }
            }

            /* 플로팅 도형 추가 스타일 */
            .shape {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .shape:hover {
                transform: scale(1.1) !important;
            }

            /* 동적 바이너리 스트림 애니메이션 */
            @keyframes binaryDrop {
                0% {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(600px);
                    opacity: 0;
                }
            }

            .binary-stream {
                line-height: 1.2;
                letter-spacing: 2px;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);
    }
}

// 앱 시작
new NameCardApp();