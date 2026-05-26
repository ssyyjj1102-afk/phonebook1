let currentGroup = '';
let allContacts = [];

const groupColors = {
  '가족': 'family',
  '친구': 'friend',
  '직장': 'work',
  '기타': 'other'
};

async function loadContacts() {
  const search = document.getElementById('searchInput').value;
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (currentGroup) params.append('group', currentGroup);

  const res = await fetch(`/api/contacts?${params}`);
  const contacts = await res.json();
  allContacts = contacts;
  renderContacts(contacts);
  updateStats();
}

async function updateStats() {
  const res = await fetch('/api/contacts');
  const all = await res.json();
  document.getElementById('totalCount').textContent = all.length;
  document.getElementById('familyCount').textContent = all.filter(c => c.group === '가족').length;
  document.getElementById('friendCount').textContent = all.filter(c => c.group === '친구').length;
  document.getElementById('workCount').textContent = all.filter(c => c.group === '직장').length;
}

function renderContacts(contacts) {
  const grid = document.getElementById('contactsGrid');
  const empty = document.getElementById('emptyState');

  if (contacts.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = contacts.map(c => `
    <div class="contact-card" data-group="${c.group}">
      <div class="card-top">
        <div class="avatar avatar-${groupColors[c.group] || 'other'}">
          ${c.name.charAt(0)}
        </div>
        <div>
          <div class="card-name">${escapeHtml(c.name)}</div>
          <span class="group-badge badge-${c.group}">${c.group}</span>
        </div>
      </div>
      <div class="card-info">
        <div class="info-row">
          <span class="icon">📱</span>
          <span>${escapeHtml(c.phone)}</span>
        </div>
        ${c.email ? `
        <div class="info-row">
          <span class="icon">✉️</span>
          <span>${escapeHtml(c.email)}</span>
        </div>` : ''}
      </div>
      <div class="card-actions">
        <button class="btn-edit" onclick="openEditModal(${JSON.stringify(c).replace(/"/g, '&quot;')})">✏️ 수정</button>
        <button class="btn-delete" onclick="deleteContact(${c.id}, '${escapeHtml(c.name)}')">🗑️ 삭제</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function filterContacts() {
  loadContacts();
}

function setGroup(group) {
  currentGroup = group;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.group === group);
  });
  loadContacts();
}

function openModal() {
  document.getElementById('modalTitle').textContent = '연락처 추가';
  document.getElementById('editId').value = '';
  document.getElementById('inputName').value = '';
  document.getElementById('inputPhone').value = '';
  document.getElementById('inputEmail').value = '';
  document.getElementById('inputGroup').value = '가족';
  document.getElementById('formError').textContent = '';
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('inputName').focus();
}

function openEditModal(contact) {
  document.getElementById('modalTitle').textContent = '연락처 수정';
  document.getElementById('editId').value = contact.id;
  document.getElementById('inputName').value = contact.name;
  document.getElementById('inputPhone').value = contact.phone;
  document.getElementById('inputEmail').value = contact.email || '';
  document.getElementById('inputGroup').value = contact.group;
  document.getElementById('formError').textContent = '';
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal(event) {
  if (event && event.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open');
}

async function saveContact() {
  const id = document.getElementById('editId').value;
  const name = document.getElementById('inputName').value.trim();
  const phone = document.getElementById('inputPhone').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  const group = document.getElementById('inputGroup').value;
  const errorEl = document.getElementById('formError');

  if (!name) { errorEl.textContent = '이름을 입력해주세요'; return; }
  if (!phone) { errorEl.textContent = '전화번호를 입력해주세요'; return; }
  errorEl.textContent = '';

  const data = { name, phone, email, group };

  try {
    let res;
    if (id) {
      res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    if (!res.ok) {
      const err = await res.json();
      errorEl.textContent = err.error || '오류가 발생했습니다';
      return;
    }

    document.getElementById('modalOverlay').classList.remove('open');
    loadContacts();
  } catch (e) {
    errorEl.textContent = '서버 오류가 발생했습니다';
  }
}

async function deleteContact(id, name) {
  if (!confirm(`"${name}"을(를) 삭제하시겠습니까?`)) return;
  await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  loadContacts();
}

// 키보드 단축키
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('modalOverlay').classList.remove('open');
  if (e.key === 'Enter' && document.getElementById('modalOverlay').classList.contains('open')) saveContact();
});

loadContacts();
