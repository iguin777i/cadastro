// URL base da API
const API_URL = "https://cadastro-l1yw.onrender.com/jogos";

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
  try {
    const jogoId = document.getElementById("jogoId").value;
    const jogo = {
      nome: document.getElementById("nome").value,
      descricao: document.getElementById("descricao").value,
      genero: document.getElementById("genero").value,
      preco: parseFloat(document.getElementById("preco").value) || 0
    };

    console.log('Salvando jogo:', editando ? 'Edição' : 'Novo', jogo);

    const url = editando ? `${API_URL}/${jogoId}` : API_URL;
    const method = editando ? "PUT" : "POST";

    console.log('Fazendo requisição para:', url, 'método:', method);

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jogo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ${response.status} ao salvar o jogo`);
    }

    console.log('Jogo salvo com sucesso');

    const modal = bootstrap.Modal.getInstance(document.getElementById("jogoModal"));
    modal.hide();
    await carregarJogos();
    limparFormulario();
  } catch (error) {
    console.error("Erro detalhado ao salvar jogo:", error);
    alert(`Erro ao salvar o jogo: ${error.message}`);
  }
}

// Função para editar um jogo
async function editarJogo(id) {
  try {
    console.log('Iniciando edição do jogo:', id);
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar jogo: ${response.status}`);
    }
    
    const jogo = await response.json();
    console.log('Dados do jogo recebidos:', jogo);

    if (!jogo) {
      throw new Error('Jogo não encontrado');
    }

    // Preencher o formulário
    document.getElementById("jogoId").value = jogo.id;
    document.getElementById("nome").value = jogo.nome || '';
    document.getElementById("descricao").value = jogo.descricao || '';
    document.getElementById("genero").value = jogo.genero || '';
    document.getElementById("preco").value = jogo.preco || '0';

    editando = true;
    document.getElementById("modalTitle").textContent = "Editar Jogo";
    
    // Abrir o modal
    const modalElement = document.getElementById("jogoModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    console.log('Modal de edição aberto com sucesso');
  } catch (error) {
    console.error("Erro detalhado ao editar jogo:", error);
    alert(`Erro ao carregar dados do jogo: ${error.message}`);
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
