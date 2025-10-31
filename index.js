import users from './users.json' assert { type: 'json' };

const filtrar = users.map(user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone
}));

console.log('Users data imported successfully.', filtrar);