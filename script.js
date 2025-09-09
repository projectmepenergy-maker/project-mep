// Importando Firebase
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

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ======== Máscara automática de CPF ========
const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", () => {
  let value = cpfInput.value.replace(/\D/g, ""); // Remove tudo que não for número

  if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

  // Formata como 000.000.000-00
  if (value.length > 9) {
    cpfInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (value.length > 6) {
    cpfInput.value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  } else if (value.length > 3) {
    cpfInput.value = value.replace(/(\d{3})(\d+)/, "$1.$2");
  } else {
    cpfInput.value = value;
  }
});

// ======== Função para buscar o projeto pelo CPF ========
export async function buscarProjeto() {
  const cpfFormatado = document.getElementById("cpf").value.trim();
  const error = document.getElementById("error");
  error.textContent = "";

  // Remove pontos e traço antes de buscar no Firebase
  const cpfLimpo = cpfFormatado.replace(/\D/g, "");

  if (cpfLimpo.length !== 11) {
    error.textContent = "Digite um CPF válido (11 números).";
    return;
  }

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projetos/${cpfLimpo}`));

    if (snapshot.exists()) {
      const projeto = snapshot.val();

      // Preenche os dados na tela
      document.getElementById("protocolo").textContent = ocultarProtocolo(projeto.protocolo);
      document.getElementById("uc").textContent = projeto.uc;
      document.getElementById("nome").textContent = projeto.nome;
      document.getElementById("status").textContent = projeto.status;
      document.getElementById("prazo").textContent = projeto.prazo;

      // Alterna telas
      document.getElementById("cpf-screen").classList.add("hidden");
      document.getElementById("result-screen").classList.remove("hidden");
    } else {
      error.textContent = "Nenhum projeto encontrado para este CPF.";
    }
  } catch (err) {
    console.error("Erro ao buscar projeto:", err);
    error.textContent = "Erro ao buscar projeto. Tente novamente mais tarde.";
  }
}

// ======== Função para ocultar os primeiros dígitos do protocolo ========
function ocultarProtocolo(protocolo) {
  const ultimos3 = protocolo.slice(-3);
  return "***" + ultimos3;
}

// ======== Voltar para tela inicial ========
export function voltar() {
  document.getElementById("cpf-screen").classList.remove("hidden");
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("cpf").value = "";
}

// Tornando funções globais
window.buscarProjeto = buscarProjeto;
window.voltar = voltar;
