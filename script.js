import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SUA_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
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
