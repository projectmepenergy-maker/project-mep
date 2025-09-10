import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Configuração Firebase
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

// Elementos
const btnBuscar = document.getElementById("btnBuscar");
const cpfInput = document.getElementById("cpf");
const errorMsg = document.getElementById("error");
const loadingDiv = document.getElementById("loading");

const cpfScreen = document.getElementById("cpf-screen");
const resultScreen = document.getElementById("result-screen");

// Função para mascarar protocolo
function mascararProtocolo(protocolo) {
  if (!protocolo) return "-";
  const ult3 = protocolo.slice(-3);
  const asteriscos = "*".repeat(protocolo.length - 3);
  return asteriscos + ult3;
}

// Função para aplicar máscara de CPF enquanto digita
cpfInput.addEventListener("input", (e) => {
  let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
  if (valor.length > 11) valor = valor.slice(0, 11); // máximo 11 dígitos

  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  e.target.value = valor;
});

// Evento de busca
btnBuscar.addEventListener("click", async () => {
  let cpf = cpfInput.value.trim();
  if (!cpf) {
    errorMsg.textContent = "Digite um CPF para consultar.";
    return;
  }

  // Remove máscara antes de buscar no Firebase
  cpf = cpf.replace(/\D/g, "");

  errorMsg.textContent = "";
  loadingDiv.classList.remove("hidden");

  try {
    const snapshot = await get(child(ref(db), "clientes/" + cpf));
    loadingDiv.classList.add("hidden");

    if (snapshot.exists()) {
      const dados = snapshot.val();
      document.getElementById("protocolo").textContent = mascararProtocolo(dados.protocolo);
      document.getElementById("uc").textContent = dados.uc || "-";
      document.getElementById("nome").textContent = dados.nome || "-";
      document.getElementById("status").textContent = dados.status || "-";
      document.getElementById("prazo").textContent = dados.prazo || "-";

      cpfScreen.classList.add("hidden");
      resultScreen.classList.remove("hidden");
    } else {
      errorMsg.textContent = "Nenhum projeto encontrado com esse CPF.";
    }
  } catch (error) {
    console.error(error);
    loadingDiv.classList.add("hidden");
    errorMsg.textContent = "Erro na consulta. Tente novamente.";
  }
});

// Botão voltar
document.getElementById("btnVoltar").addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  cpfScreen.classList.remove("hidden");
  cpfInput.value = "";
  errorMsg.textContent = "";
});
