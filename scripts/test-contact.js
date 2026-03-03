// Script de teste: envia um POST para /api/contact
// Uso: node scripts/test-contact.js
const url = 'http://localhost:3000/api/contact';


async function run() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Teste', sobrenome: 'Local', telefone: '11999999999', email: 'teste@example.com', mensagem: 'Mensagem de teste' }),
    });

    const data = await res.text();
    console.log('Status:', res.status);
    console.log('Resposta:', data);
  } catch (err) {
    console.error('Erro ao conectar com', url);
    console.error(err.message || err);
  }
}

run();
