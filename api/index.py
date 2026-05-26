from flask import Flask, request, jsonify, render_template
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static'),
    static_url_path='/static'
)

# In-memory storage (Vercel serverless는 파일 저장이 안 되므로 메모리 사용)
contacts = [
    {"id": 1, "name": "홍길동", "phone": "010-1234-5678", "email": "hong@example.com", "group": "가족"},
    {"id": 2, "name": "김철수", "phone": "010-9876-5432", "email": "kim@example.com", "group": "친구"},
    {"id": 3, "name": "이영희", "phone": "010-5555-1234", "email": "lee@example.com", "group": "직장"},
]
next_id = 4

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    global contacts
    search = request.args.get('search', '').lower()
    group = request.args.get('group', '')
    
    result = contacts
    if search:
        result = [c for c in result if search in c['name'].lower() or search in c['phone'] or search in c.get('email', '').lower()]
    if group:
        result = [c for c in result if c.get('group') == group]
    
    return jsonify(result)

@app.route('/api/contacts', methods=['POST'])
def add_contact():
    global contacts, next_id
    data = request.get_json()
    
    if not data.get('name') or not data.get('phone'):
        return jsonify({'error': '이름과 전화번호는 필수입니다'}), 400
    
    contact = {
        'id': next_id,
        'name': data['name'],
        'phone': data['phone'],
        'email': data.get('email', ''),
        'group': data.get('group', '기타')
    }
    contacts.append(contact)
    next_id += 1
    return jsonify(contact), 201

@app.route('/api/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    global contacts
    data = request.get_json()
    
    for i, c in enumerate(contacts):
        if c['id'] == contact_id:
            contacts[i] = {**c, **data, 'id': contact_id}
            return jsonify(contacts[i])
    
    return jsonify({'error': '연락처를 찾을 수 없습니다'}), 404

@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    global contacts
    contacts = [c for c in contacts if c['id'] != contact_id]
    return jsonify({'message': '삭제되었습니다'})

if __name__ == '__main__':
    app.run(debug=True)
