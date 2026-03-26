/**
 * 대교멤버스 CRM 관리자 - 공통 스크립트
 * 모든 프로토타입에서 공통으로 사용하는 JavaScript
 * 버전: 1.0
 */

// 서브메뉴 토글
function toggleSubmenu(element) {
    const navItem = element.closest('.nav-item');
    const arrow = element.querySelector('.arrow');
    const submenu = navItem.querySelector('.submenu');

    if (submenu) {
        submenu.classList.toggle('show');
        if (arrow) {
            arrow.classList.toggle('rotate');
        }
    }
}

// 모달 열기
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// 모달 닫기
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// 확인 모달 표시
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;

    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-message').innerHTML = message;
    modal.classList.add('active');

    const confirmBtn = modal.querySelector('.btn-confirm');
    if (confirmBtn && onConfirm) {
        confirmBtn.onclick = () => {
            closeModal('confirm-modal');
            onConfirm();
        };
    }
}

// 알림 모달 표시
function showAlertModal(title, message, onClose) {
    const modal = document.getElementById('alert-modal');
    if (!modal) return;

    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-message').innerHTML = message;
    modal.classList.add('active');

    const closeBtn = modal.querySelector('.btn-close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeModal('alert-modal');
            if (onClose) onClose();
        };
    }
}

// 페이지네이션 초기화
// - containerId: 페이지네이션 컨테이너 ID
// - totalItems: 전체 데이터 건수
// - defaultPageSize: 기본 페이지 크기 (기본값: 20)
// - onPageChange: 페이지/사이즈 변경 콜백 function(page, pageSize)
// 반환값: 외부에서 상태를 제어할 수 있는 컨트롤러 객체
function initPagination(containerId, totalItems, defaultPageSize, onPageChange) {
    var container = document.getElementById(containerId);
    if (!container) return null;

    var pageSizeOptions = [10, 20, 50, 100];
    var pageSize = defaultPageSize || 20;
    var currentPage = 1;
    var maxVisiblePages = 10;

    function getTotalPages() {
        return Math.max(1, Math.ceil(totalItems / pageSize));
    }

    function render() {
        container.innerHTML = '';
        var totalPages = getTotalPages();

        // 페이지 크기 선택
        var sizeWrap = document.createElement('div');
        sizeWrap.style.cssText = 'display:flex;align-items:center;gap:6px;margin-right:16px;';
        var sizeLabel = document.createElement('span');
        sizeLabel.textContent = '페이지 크기:';
        sizeLabel.style.cssText = 'font-size:13px;color:#666;white-space:nowrap;';
        var sizeSelect = document.createElement('select');
        sizeSelect.style.cssText = 'padding:4px 8px;border:1px solid #ddd;border-radius:6px;font-size:13px;color:#333;cursor:pointer;';
        pageSizeOptions.forEach(function(size) {
            var opt = document.createElement('option');
            opt.value = size;
            opt.textContent = size + '건';
            if (size === pageSize) opt.selected = true;
            sizeSelect.appendChild(opt);
        });
        sizeSelect.onchange = function() {
            pageSize = parseInt(this.value);
            currentPage = 1;
            render();
            if (onPageChange) onPageChange(currentPage, pageSize);
        };
        sizeWrap.appendChild(sizeLabel);
        sizeWrap.appendChild(sizeSelect);
        container.appendChild(sizeWrap);

        // 처음 버튼 ◀◀
        var firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.textContent = '«';
        firstBtn.disabled = currentPage === 1;
        firstBtn.onclick = function() { goToPage(1); };
        container.appendChild(firstBtn);

        // 이전 버튼 ◀
        var prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.textContent = '‹';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = function() { goToPage(currentPage - 1); };
        container.appendChild(prevBtn);

        // 페이지 번호 범위 계산 (최대 10개)
        var startPage, endPage;
        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            var half = Math.floor(maxVisiblePages / 2);
            startPage = currentPage - half;
            endPage = currentPage + half - 1;
            if (startPage < 1) {
                startPage = 1;
                endPage = maxVisiblePages;
            }
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = totalPages - maxVisiblePages + 1;
            }
        }

        // 페이지 번호 버튼
        for (var i = startPage; i <= endPage; i++) {
            var pageBtn = document.createElement('button');
            pageBtn.className = 'page-num' + (i === currentPage ? ' active' : '');
            pageBtn.textContent = i;
            pageBtn.onclick = (function(page) {
                return function() { goToPage(page); };
            })(i);
            container.appendChild(pageBtn);
        }

        // 다음 버튼 ▶
        var nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.textContent = '›';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = function() { goToPage(currentPage + 1); };
        container.appendChild(nextBtn);

        // 마지막 버튼 ▶▶
        var lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.textContent = '»';
        lastBtn.disabled = currentPage === totalPages;
        lastBtn.onclick = function() { goToPage(totalPages); };
        container.appendChild(lastBtn);

        // 페이지 정보
        var pageInfo = document.createElement('span');
        pageInfo.style.cssText = 'margin-left:16px;font-size:13px;color:#666;white-space:nowrap;';
        pageInfo.textContent = currentPage + ' / ' + totalPages + ' 페이지';
        container.appendChild(pageInfo);
    }

    function goToPage(page) {
        var totalPages = getTotalPages();
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        currentPage = page;
        render();
        if (onPageChange) onPageChange(currentPage, pageSize);
    }

    // 외부 제어용 컨트롤러 반환
    var controller = {
        goToPage: goToPage,
        getState: function() {
            return { page: currentPage, pageSize: pageSize, totalItems: totalItems };
        },
        setState: function(state) {
            if (state.pageSize !== undefined) pageSize = state.pageSize;
            if (state.page !== undefined) currentPage = state.page;
            if (state.totalItems !== undefined) totalItems = state.totalItems;
            render();
        },
        updateTotal: function(newTotal) {
            totalItems = newTotal;
            var totalPages = getTotalPages();
            if (currentPage > totalPages) currentPage = totalPages;
            render();
        }
    };

    render();
    return controller;
}

// 검색 폼 초기화
function resetSearchForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// 테이블 정렬
function sortTable(tableId, columnIndex, isNumeric = false) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent.trim();
        const bVal = b.cells[columnIndex].textContent.trim();

        if (isNumeric) {
            return parseFloat(aVal) - parseFloat(bVal);
        }
        return aVal.localeCompare(bVal, 'ko');
    });

    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
}

// 날짜 포맷
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

// 숫자 포맷 (천단위 콤마)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 링크 클릭 이벤트
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.querySelector('.arrow')) {
                e.preventDefault();
                toggleSubmenu(this);
            }
        });
    });

    // 모달 바깥 클릭 시 닫기
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
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
});
