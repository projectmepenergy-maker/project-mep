import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referência para os elementos
const formCadastro = document.getElementById("formCadastro");
const tabelaClientes = document.getElementById("tabelaClientes");

// Cadastrar cliente
formCadastro.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const endereco = document.getElementById("endereco").value.trim();

  if (!nome || !cpf || !endereco) {
    alert("Preencha todos os campos!");
    return;
  }

  const clienteRef = ref(db, "clientes/" + cpf);

  set(clienteRef, {
    nome: nome,
    cpf: cpf,
    endereco: endereco
  })
    .then(() => {
      alert("Cliente cadastrado com sucesso!");
      formCadastro.reset();
      carregarClientes();
    })
    .catch((error) => {
      console.error("Erro ao cadastrar:", error);
    });
});

// Carregar clientes em tempo real
function carregarClientes() {
  const clientesRef = ref(db, "clientes");
  onValue(clientesRef, (snapshot) => {
    tabelaClientes.innerHTML = "";

    snapshot.forEach((childSnapshot) => {
      const cliente = childSnapshot.val();
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.cpf}</td>
        <td>${cliente.endereco}</td>
        <td>
          <button onclick="excluirCliente('${cliente.cpf}')">Excluir</button>
        </td>
      `;

      tabelaClientes.appendChild(tr);
    });
  });
}

window.excluirCliente = function (cpf) {
  const clienteRef = ref(db, "clientes/" + cpf);

  if (confirm("Deseja realmente excluir este cliente?")) {
    remove(clienteRef)
      .then(() => {
        alert("Cliente excluído com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao excluir:", error);
      });
  }
};

// Inicializa a tabela
carregarClientes();

