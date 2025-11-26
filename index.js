import users from './users.json' assert { type: 'json' };

const generateTempId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `tmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const adaptUsers = users.map((user) => ({
  id: user.userId ?? user.id ?? generateTempId(),
  name: user.userName ?? user.name ?? 'Usuário sem nome',
  email: user.email ?? 'Não informado',
  phone: user.phone ?? 'Não informado',
  store: user.storeName ?? 'Loja não informada',
  lastLogin: user.lastLogin ?? null,
}));

console.table(adaptUsers.slice(0, 5));