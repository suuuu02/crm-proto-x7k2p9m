// 대교멤버스 약관 관리 시스템 v2 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTableRowClick();
    initPagination();
    initSearch();
    initTabs();
    initDragAndDrop();
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

    // 외부 프로토타입 링크: 한글/공백 경로 인코딩 처리
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('../../') && !link.closest('.nav-item')?.querySelector('.submenu')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // 경로의 각 세그먼트를 개별 인코딩 (..는 제외)
                const parts = href.split('/');
                const encodedPath = parts.map(part => part === '..' ? part : encodeURIComponent(part)).join('/');
                window.location.href = encodedPath;
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

    if (firstBtn) {
        firstBtn.addEventListener('click', function() {
            pageNums.forEach(b => b.classList.remove('active'));
            if (pageNums[0]) {
                pageNums[0].classList.add('active');
            }
        });
    }

    if (lastBtn) {
        lastBtn.addEventListener('click', function() {
            pageNums.forEach(b => b.classList.remove('active'));
            if (pageNums[pageNums.length - 1]) {
                pageNums[pageNums.length - 1].classList.add('active');
            }
        });
    }
}

// 검색 기능
function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchTerms);
    }

    // Enter 키로 검색
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTerms();
            }
        });
    });
}

function searchTerms() {
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

// 탭 기능
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabGroup = this.closest('.tab-group');
            if (tabGroup) {
                tabGroup.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            } else {
                tabs.forEach(t => t.classList.remove('active'));
            }
            this.classList.add('active');

            // 탭 콘텐츠 전환
            const tabId = this.dataset.tab;
            if (tabId) {
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            }

            // 그룹사 탭 클릭 시 해당 그룹사 데이터 로드
            const companyId = this.dataset.companyId;
            if (companyId) {
                loadGroupCompanyData(companyId);
            }
        });
    });
}

// 그룹사 데이터 로드 (더미)
function loadGroupCompanyData(companyId) {
    console.log('Loading data for company:', companyId);
    // 실제 구현시 API 호출
}

// 드래그 앤 드롭
function initDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.drag-container, .config-list');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            updateOrder();
        });
    });

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateOrder() {
    const items = document.querySelectorAll('.config-item');
    items.forEach((item, index) => {
        const orderNum = item.querySelector('.order-num');
        if (orderNum) {
            orderNum.textContent = index + 1;
        }
    });
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

// 한국어 날짜 포맷
function formatDateKorean(date) {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// 에디터 명령어
function execCommand(command, value = null) {
    document.execCommand(command, false, value);
}

// 에디터 툴바 버튼 이벤트
document.querySelectorAll('.editor-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const title = this.title;

        switch(title) {
            case '굵게':
                execCommand('bold');
                break;
            case '기울임':
                execCommand('italic');
                break;
            case '밑줄':
                execCommand('underline');
                break;
            case '제목1':
                execCommand('formatBlock', '<h1>');
                break;
            case '제목2':
                execCommand('formatBlock', '<h2>');
                break;
            case '제목3':
                execCommand('formatBlock', '<h3>');
                break;
            case '목록':
                execCommand('insertUnorderedList');
                break;
            case '번호목록':
                execCommand('insertOrderedList');
                break;
            case '링크':
                const url = prompt('링크 URL을 입력하세요:');
                if (url) {
                    execCommand('createLink', url);
                }
                break;
            case '표':
                insertTable();
                break;
        }
    });
});

// 표 삽입
function insertTable() {
    const rows = prompt('행 수를 입력하세요:', '3');
    const cols = prompt('열 수를 입력하세요:', '3');

    if (rows && cols) {
        let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
        for (let i = 0; i < parseInt(rows); i++) {
            table += '<tr>';
            for (let j = 0; j < parseInt(cols); j++) {
                table += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>';
            }
            table += '</tr>';
        }
        table += '</table><br>';

        document.execCommand('insertHTML', false, table);
    }
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

// 토글 스위치
function initToggles() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const itemId = this.dataset.itemId;
            const isActive = this.checked;
            console.log('Toggle:', itemId, isActive);
            // 실제 구현시 API 호출
        });
    });
}

// 소속 선택에 따른 그룹사 드롭다운 표시/숨김
function handleOwnerTypeChange(selectElement) {
    const groupCompanySelect = document.getElementById('groupCompanySelect');
    const groupCompanyGroup = document.getElementById('groupCompanyGroup');

    if (selectElement.value === 'GROUP' && groupCompanyGroup) {
        groupCompanyGroup.style.display = 'block';
        if (groupCompanySelect) {
            groupCompanySelect.required = true;
        }
    } else if (groupCompanyGroup) {
        groupCompanyGroup.style.display = 'none';
        if (groupCompanySelect) {
            groupCompanySelect.required = false;
            groupCompanySelect.value = '';
        }
    }
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

// 미리보기 기능
function previewTerm() {
    const content = document.getElementById('editorContent')?.innerHTML;
    const termItem = document.getElementById('termItem')?.selectedOptions[0]?.text;

    if (!content || !termItem) {
        alert('약관 항목과 내용을 입력해주세요.');
        return;
    }

    // 새 창에서 미리보기
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>약관 미리보기 - ${termItem}</title>
            <style>
                body {
                    font-family: 'Noto Sans KR', sans-serif;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                    line-height: 1.8;
                }
                h1 { font-size: 24px; margin-bottom: 30px; }
                h2 { font-size: 18px; margin-top: 30px; }
                h3 { font-size: 16px; margin-top: 20px; }
                ol, ul { padding-left: 20px; }
                li { margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <h1>${termItem}</h1>
            ${content}
        </body>
        </html>
    `);
    previewWindow.document.close();
}

// 회원가입 약관 구성 미리보기
function previewSignupConfig() {
    openModal('previewModal');
}

// 구성 저장
function saveConfig() {
    const configItems = document.querySelectorAll('.config-item');
    const config = [];

    configItems.forEach((item, index) => {
        config.push({
            order: index + 1,
            itemId: item.dataset.itemId,
            isActive: item.querySelector('.toggle-switch input')?.checked
        });
    });

    console.log('Saving config:', config);
    // 실제 구현시 API 호출

    alert('저장되었습니다.');
}

// 삭제 확인
function confirmDelete(itemName) {
    return confirm(`'${itemName}' 항목을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`);
}

// 숫자만 입력
function numbersOnly(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

// 영문 대문자 + 언더스코어만 입력 (항목 코드용)
function codeFormat(input) {
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
}
