class UserDashboard {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.loadUsers();
    }

    async loadUsers() {
        try {
            const loading = document.getElementById('loading');
            loading.style.display = 'flex';
            
            const response = await fetch('./users.json');
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar: ${response.status}`);
            }
            
            const data = await response.json();
            this.users = data.map(user => this.normalizeUser(user));
            this.filteredUsers = [...this.users];
            
            loading.style.display = 'none';
            this.init();
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            document.getElementById('loading').innerHTML = `
                <div style="text-align: center; color: var(--danger);">
                    <p style="font-size: 1.2rem; margin-bottom: 10px;">❌ Erro ao carregar dados</p>
                    <p>${error.message}</p>
                    <p style="margin-top: 20px; font-size: 0.9rem;">Verifique se o arquivo users.json está no mesmo diretório</p>
                </div>
            `;
        }
    }

    init() {
        this.renderStats();
        this.renderUsers();
        this.setupEventListeners();
    }

    normalizeUser(user) {
        const fallbackName = user.userName || user.name || 'Usuário sem nome';
        const fallbackId = user.userId || user.id || this.generateTempId();
        return {
            id: fallbackId,
            name: fallbackName,
            email: user.email || 'Não informado',
            phone: user.phone || '',
            storeName: user.storeName || 'Loja não informada',
            lastLogin: user.lastLogin || null
        };
    }

    setupEventListeners() {
        // Event listeners para botões de copiar serão adicionados após renderizar
        document.addEventListener('click', (e) => {
            if (e.target.closest('.copy-phone-btn')) {
                const btn = e.target.closest('.copy-phone-btn');
                const phone = btn.getAttribute('data-phone');
                if (phone && phone !== 'Não informado') {
                    this.copyToClipboard(phone, btn);
                }
            }
        });
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Feedback visual
            const originalHTML = button.innerHTML;
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>';
            button.style.background = 'var(--success)';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 2000);
        } catch (err) {
            console.error('Erro ao copiar:', err);
            alert('Erro ao copiar número. Tente novamente.');
        }
    }

    renderStats() {
        const totalUsers = this.users.length;
        const recentLogins = this.users.filter(u => this.isLoginRecent(u.lastLogin, 1)).length;
        const uniqueStores = new Set(this.users.map(u => u.storeName)).size;
        const phonesAvailable = this.users.filter(u => Boolean(u.phone)).length;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('activeUsers').textContent = recentLogins;
        document.getElementById('adminUsers').textContent = uniqueStores;
        document.getElementById('verifiedUsers').textContent = phonesAvailable;
    }

    renderUsers() {
        const container = document.getElementById('usersContainer');
        const loading = document.getElementById('loading');

        loading.style.display = 'none';

        if (this.filteredUsers.length === 0) {
            container.innerHTML = '<div class="no-results"><p>Nenhum usuário encontrado</p></div>';
            return;
        }

        container.innerHTML = this.filteredUsers.map(user => this.createUserCard(user)).join('');
    }

    createUserCard(user) {
        const initials = this.getInitials(user.name);
        const formattedPhone = user.phone || 'Não informado';
        const lastLogin = user.lastLogin ? this.formatDate(user.lastLogin) : 'Nunca acessou';
        const recentStatus = this.isLoginRecent(user.lastLogin, 7);
        const storeName = this.escapeHtml(user.storeName);

        return `
            <div class="user-card">
                <div class="user-header">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-info">
                        <div class="user-name">${this.escapeHtml(user.name)}</div>
                        <span class="user-store">${storeName}</span>
                    </div>
                </div>
                <div class="user-details">
                    <div class="user-detail">
                        <svg class="user-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span>${this.escapeHtml(user.email)}</span>
                    </div>
                    <div class="user-detail user-detail-phone">
                        <svg class="user-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <span>${this.escapeHtml(formattedPhone)}</span>
                        ${user.phone ? `<button class="copy-phone-btn" data-phone="${this.escapeHtml(user.phone)}" title="Copiar número">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                            </svg>
                        </button>` : ''}
                    </div>
                    <div class="user-detail">
                        <svg class="user-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"></path>
                        </svg>
                        <span>Loja: ${storeName}</span>
                    </div>
                    <div class="user-detail">
                        <svg class="user-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Último login: ${lastLogin}</span>
                    </div>
                    <div class="user-detail">
                        <svg class="user-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a4 4 0 10-8 0v6a4 4 0 108 0V8z"></path>
                        </svg>
                        <span>ID: <code class="user-id">${this.escapeHtml(user.id)}</code></span>
                    </div>
                </div>
                <div class="user-status">
                    <div class="status-indicator ${recentStatus ? 'active' : 'inactive'}"></div>
                    <span class="status-text">${recentStatus ? 'Login recente' : 'Sem acesso recente'}</span>
                </div>
            </div>
        `;
    }

    getInitials(name = '') {
        return name
            .split(' ')
            .map(word => word[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'NA';
    }

    isLoginRecent(dateString, days = 7) {
        if (!dateString) return false;
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return false;
        const diff = Date.now() - date.getTime();
        const diffDays = diff / (1000 * 60 * 60 * 24);
        return diffDays <= days;
    }

    formatDate(dateString) {
        if (!dateString) return 'Não informado';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'Não informado';
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        if (text === undefined || text === null) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    generateTempId() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `tmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }
}

// Inicializar dashboard quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new UserDashboard();
});

