import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmY6OTMVjrbHcwqidaTo8FieOneikHM5s",
  authDomain: "project-mep-d9480.firebaseapp.com",
  databaseURL: "https://project-mep-d9480-default-rtdb.firebaseio.com",
  projectId: "project-mep-d9480",
  storageBucket: "project-mep-d9480.firebasestorage.app",
  messagingSenderId: "166751082127",
  appId: "1:166751082127:web:73451eeaf1f6db43ff82fa",
  measurementId: "G-WF5V8HC48V"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Formatar CPF na entrada
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', () => {
  let v = cpfInput.value.replace(/\D/g, '');
  v = v.replace(/^(\d{3})(\d)/, '$1.$2');
  v = v.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  v = v.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  cpfInput.value = v;
});

// Botão Buscar
document.getElementById('buscar').addEventListener('click', async () => {
  const cpf = cpfInput.value.replace(/\D/g, ''); // remove pontos e traço

  if(cpf.length !== 11) {
    alert('CPF inválido!');
    return;
  }

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `projetos/${cpf}`));

  if(snapshot.exists()) {
    const data = snapshot.val();

    // Mascara protocolo: ****123
    const protocolo = data.protocolo;
    const protocoloMascara = '*'.repeat(protocolo.length - 3) + protocolo.slice(-3);

    document.getElementById('protocolo').textContent = protocoloMascara;
    document.getElementById('uc').textContent = data.uc;
    document.getElementById('nome').textContent = data.nome;
    document.getElementById('status').textContent = data.status;
    document.getElementById('prazo').textContent = data.prazo;

    document.querySelector('.consulta').style.display = 'none';
    document.getElementById('resultado').style.display = 'block';
  } else {
    alert('Projeto não encontrado!');
  }
});

// Botão Voltar
document.getElementById('voltar').addEventListener('click', () => {
  document.querySelector('.consulta').style.display = 'block';
  document.getElementById('resultado').style.display = 'none';
  cpfInput.value = '';
});
