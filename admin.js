import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// ======= CONFIGURAÇÃO REAL DO FIREBASE =======
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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ======= LOGIN SIMPLES =======
const ADMIN_PASSWORD = "123456"; // Defina sua senha
const loginScreen = document.getElementById("login-screen");
const adminScreen = document.getElementById("admin-screen");
const loginError = document.getElementById("login-error");
const listaProjetos = document.getElementById("lista-projetos");

document.getElementById("btn-login").addEventListener("click", () => {
  const senha = document.getElementById("admin-password").value.trim();
  if (senha === ADMIN_PASSWORD) {
    loginScreen.classList.add("hidden");
    adminScreen.classList.remove("hidden");
    carregarProjetos();
  } else {
    loginError.textContent = "Senha incorreta!";
  }
});

document.getElementById("btn-logout").addEventListener("click", () => {
  adminScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  document.getElementById("admin-password").value = "";
});

// ======= FUNÇÃO SALVAR PROJETO =======
document.getElementById("btn-salvar").addEventListener("click", async () => {
  const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
  const protocolo = document.getElementById("protocolo").value.trim();
  const uc = document.getElementById("uc").value.trim();
  const nome = document.getElementById("nome").value.trim();
  const status = document.getElementById("status").value.trim();
  const prazo = document.getElementById("prazo").value.trim();

  if (cpf.length !== 11) {
    alert("CPF inválido!");
    return;
  }

  console.log("Salvando projeto:", { cpf, protocolo, uc, nome, status, prazo });

  try {
    await set(ref(db, `projetos/${cpf}`), { protocolo, uc, nome, status, prazo });
    alert("Projeto salvo com sucesso!");
    limparCampos();
    carregarProjetos();
  } catch (err) {
    console.error("Erro ao salvar projeto:", err);
  }
});

// ======= FUNÇÃO CARREGAR PROJETOS =======
function carregarProjetos() {
  onValue(ref(db, "projetos"), (snapshot) => {
    listaProjetos.innerHTML = "";
    if (snapshot.exists()) {
      const dados = snapshot.val();
      for (const cpf in dados) {
        const projeto = dados[cpf];
        listaProjetos.innerHTML += `
          <tr>
            <td>${cpf}</td>
            <td>${projeto.nome}</td>
            <td>${projeto.status}</td>
            <td>
              <button onclick="editarProjeto('${cpf}')">Editar</button>
              <button onclick="excluirProjeto('${cpf}')">Excluir</button>
            </td>
          </tr>
        `;
      }
    } else {
      listaProjetos.innerHTML = "<tr><td colspan='4'>Nenhum projeto cadastrado</td></tr>";
    }
  });
}

// ======= FUNÇÃO EDITAR PROJETO =======
window.editarProjeto = async (cpf) => {
  const snapshot = await get(child(ref(db), `projetos/${cpf}`));
  if (snapshot.exists()) {
    const projeto = snapshot.val();
    document.getElementById("cpf").value = cpf;
    document.getElementById("protocolo").value = projeto.protocolo;
    document.getElementById("uc").value = projeto.uc;
    document.getElementById("nome").value = projeto.nome;
    document.getElementById("status").value = projeto.status;
    document.getElementById("prazo").value = projeto.prazo;
  }
};

// ======= FUNÇÃO EXCLUIR PROJETO =======
window.excluirProjeto = async (cpf) => {
  if (confirm("Deseja realmente excluir este projeto?")) {
    try {
      await remove(ref(db, `projetos/${cpf}`));
      alert("Projeto excluído!");
      carregarProjetos();
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
    }
  }
};

// ======= FUNÇÃO LIMPAR CAMPOS =======
function limparCampos() {
  document.getElementById("cpf").value = "";
  document.getElementById("protocolo").value = "";
  document.getElementById("uc").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("status").value = "";
  document.getElementById("prazo").value = "";
}
