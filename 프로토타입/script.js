// 대교멤버스 서비스 관리 시스템 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTableRowClick();
    initPagination();
    initSearch();
});

// 네비게이션 토글
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');
        const submenu = item.querySelector('.submenu');

        if (submenu && navLink) {
            navLink.addEventListener('click', function(e) {
                if (submenu) {
                    e.preventDefault();

                    // 현재 메뉴 토글
                    item.classList.toggle('expanded');
                    submenu.classList.toggle('show');

                    const arrow = navLink.querySelector('.arrow');
                    if (arrow) {
                        arrow.classList.toggle('rotate');
                    }
                }
            });
        }
    });
}

// 테이블 행 클릭
function initTableRowClick() {
    const tableRows = document.querySelectorAll('.data-table tbody tr');

    tableRows.forEach(row => {
        if (!row.querySelector('button') && !row.classList.contains('no-click')) {
            row.style.cursor = 'pointer';
            row.addEventListener('click', function(e) {
                // 버튼이나 체크박스 클릭 시 제외
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
                    return;
                }

                const href = this.dataset.href;
                if (href) {
                    window.location.href = href;
                }
            });
        }
    });
}

// 페이지네이션
function initPagination() {
    const pageNums = document.querySelectorAll('.page-num');

    pageNums.forEach(btn => {
        btn.addEventListener('click', function() {
            pageNums.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('Page:', this.textContent);
        });
    });

    // 이전/다음 버튼
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    const firstBtn = document.querySelector('.page-btn.first');
    const lastBtn = document.querySelector('.page-btn.last');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const active = document.querySelector('.page-num.active');
            const prev = active?.previousElementSibling;
            if (prev && prev.classList.contains('page-num')) {
                active.classList.remove('active');
                prev.classList.add('active');
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const active = document.querySelector('.page-num.active');
            const next = active?.nextElementSibling;
            if (next && next.classList.contains('page-num')) {
                active.classList.remove('active');
                next.classList.add('active');
            }
        });
    }
}

// 검색 기능
function initSearch() {
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchServices);
    }

    // Enter 키로 검색
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchServices();
            }
        });
    });
}

function searchServices() {
    const selects = document.querySelectorAll('.search-select');
    const inputs = document.querySelectorAll('.search-input');

    let searchParams = {};
    selects.forEach(select => {
        if (select.id) {
            searchParams[select.id] = select.value;
        }
    });
    inputs.forEach(input => {
        if (input.id) {
            searchParams[input.id] = input.value;
        }
    });

    console.log('Search:', searchParams);
    // 실제 구현시 API 호출 및 테이블 갱신
}

// 날짜 포맷팅
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 날짜/시간 포맷팅
function formatDateTime(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 모달 관련
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// 모달 외부 클릭시 닫기
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// 영문 대문자 + 언더스코어만 입력 (코드용)
function codeFormat(input) {
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
}

// 폼 유효성 검사
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('invalid');
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.classList.remove('invalid');
        }
    });

    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        alert('필수 항목을 입력해주세요.');
    }

    return isValid;
}
