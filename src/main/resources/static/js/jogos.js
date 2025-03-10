// URL base da API
const API_URL = "http://localhost:8080/jogos";

// Variável para controlar se estamos editando ou criando
let editando = false;

// Carregar jogos ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarJogos);

// Função para carregar a lista de jogos
async function carregarJogos() {
  try {
    const response = await fetch(API_URL);
    const jogos = await response.json();
    const tbody = document.getElementById("jogosTableBody");
    tbody.innerHTML = "";

    jogos.forEach((jogo) => {
      tbody.innerHTML += `
                <tr>
                    <td>${jogo.id}</td>
                    <td>${jogo.nome}</td>
                    <td>${jogo.descricao}</td>
                    <td>${jogo.genero || "-"}</td>
                    <td>R$ ${jogo.preco?.toFixed(2) || "0.00"}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarJogo(${
                          jogo.id
                        })">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deletarJogo(${
                          jogo.id
                        })">Excluir</button>
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    console.error("Erro ao carregar jogos:", error);
    alert("Erro ao carregar a lista de jogos!");
  }
}

// Função para salvar um jogo (criar ou atualizar)
async function salvarJogo() {
  const jogoId = document.getElementById("jogoId").value;
  const jogo = {
    nome: document.getElementById("nome").value,
    descricao: document.getElementById("descricao").value,
    genero: document.getElementById("genero").value,
    preco: parseFloat(document.getElementById("preco").value),
  };

  try {
    const url = editando ? `${API_URL}/${jogoId}` : API_URL;
    const method = editando ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jogo),
    });

    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("jogoModal")
      );
      modal.hide();
      carregarJogos();
      limparFormulario();
    } else {
      const error = await response.json();
      alert(error.message || "Erro ao salvar o jogo!");
    }
  } catch (error) {
    console.error("Erro ao salvar jogo:", error);
    alert("Erro ao salvar o jogo!");
  }
}

// Função para editar um jogo
async function editarJogo(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const jogo = await response.json();

    document.getElementById("jogoId").value = jogo.id;
    document.getElementById("nome").value = jogo.nome;
    document.getElementById("descricao").value = jogo.descricao;
    document.getElementById("genero").value = jogo.genero || "";
    document.getElementById("preco").value = jogo.preco || "";

    editando = true;
    document.getElementById("modalTitle").textContent = "Editar Jogo";
    const modal = new bootstrap.Modal(document.getElementById("jogoModal"));
    modal.show();
  } catch (error) {
    console.error("Erro ao carregar jogo para edição:", error);
    alert("Erro ao carregar dados do jogo!");
  }
}

// Função para deletar um jogo
async function deletarJogo(id) {
  if (confirm("Tem certeza que deseja excluir este jogo?")) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        carregarJogos();
      } else {
        alert("Erro ao excluir o jogo!");
      }
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
      alert("Erro ao excluir o jogo!");
    }
  }
}

// Função para limpar o formulário
function limparFormulario() {
  document.getElementById("jogoForm").reset();
  document.getElementById("jogoId").value = "";
  editando = false;
  document.getElementById("modalTitle").textContent = "Novo Jogo";
}

// Limpar formulário quando o modal for fechado
document
  .getElementById("jogoModal")
  .addEventListener("hidden.bs.modal", limparFormulario);
