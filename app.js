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
            
            this.users = await response.json();
            this.filteredUsers = this.users;
            
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
        const activeUsers = this.users.filter(u => u.isActive).length;
        const adminUsers = this.users.filter(u => u.role === 'ADMIN').length;
        const verifiedUsers = this.users.filter(u => u.last2FAVerifiedAt !== null).length;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('activeUsers').textContent = activeUsers;
        document.getElementById('adminUsers').textContent = adminUsers;
        document.getElementById('verifiedUsers').textContent = verifiedUsers;
    }

    renderUsers() {
        const container = document.getElementById('usersContainer');
        const loading = document.getElementById('loading');

        loading.style.display = 'none';

        if (this.users.length === 0) {
            container.innerHTML = '<div class="no-results"><p>Nenhum usuário encontrado</p></div>';
            return;
        }

        container.innerHTML = this.users.map(user => this.createUserCard(user)).join('');
    }

    createUserCard(user) {
        const initials = this.getInitials(user.name);
        const isActive = user.isActive;
        const isVerified = user.last2FAVerifiedAt !== null;
        const roleClass = user.role.toLowerCase();
        const formattedPhone = user.phone || 'Não informado';
        const lastLogin = user.lastLogin ? this.formatDate(user.lastLogin) : 'Nunca';
        const createdAt = this.formatDate(user.createdAt);

        return `
            <div class="user-card">
                <div class="user-header">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-info">
                        <div class="user-name">${this.escapeHtml(user.name)}</div>
                        <span class="user-role ${roleClass}">${user.role}</span>
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>Criado em: ${createdAt}</span>
                    </div>
                    <div class="user-detail">
                        <svg class="user-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Último login: ${lastLogin}</span>
                    </div>
                </div>
                <div class="user-status">
                    <div class="status-indicator ${isActive ? 'active' : 'inactive'}"></div>
                    <span class="status-text">${isActive ? 'Ativo' : 'Inativo'}</span>
                    ${isVerified ? '<span class="user-verified">✓ Verificado</span>' : ''}
                </div>
            </div>
        `;
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar dashboard quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new UserDashboard();
});

