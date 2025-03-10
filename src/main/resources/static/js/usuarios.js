// URL base da API
const API_URL = "https://cadastro-l1yw.onrender.com/usuarios";

// Variável para controlar se estamos editando ou criando
let editando = false;

// Carregar usuários ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarUsuarios);

// Função para carregar a lista de usuários
async function carregarUsuarios() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar usuários: ${response.status}`);
    }
    
    const usuarios = await response.json();
    console.log('Usuários carregados:', usuarios);
    
    const tbody = document.getElementById("usuariosTableBody");
    tbody.innerHTML = "";

    usuarios.forEach((usuario) => {
      tbody.innerHTML += `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deletarUsuario(${usuario.id})">Excluir</button>
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    console.error("Erro detalhado ao carregar usuários:", error);
    alert(`Erro ao carregar a lista de usuários: ${error.message}`);
  }
}

// Função para salvar um usuário (criar ou atualizar)
async function salvarUsuario() {
  try {
    const usuarioId = document.getElementById("usuarioId").value;
    const usuario = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
    };

    console.log('Salvando usuário:', editando ? 'Edição' : 'Novo', usuario);

    const url = editando ? `${API_URL}/${usuarioId}` : API_URL;
    const method = editando ? "PUT" : "POST";

    console.log('Fazendo requisição para:', url, 'método:', method);

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ${response.status} ao salvar o usuário`);
    }

    console.log('Usuário salvo com sucesso');

    const modal = bootstrap.Modal.getInstance(document.getElementById("usuarioModal"));
    modal.hide();
    await carregarUsuarios();
    limparFormulario();
  } catch (error) {
    console.error("Erro detalhado ao salvar usuário:", error);
    alert(`Erro ao salvar o usuário: ${error.message}`);
  }
}

// Função para editar um usuário
async function editarUsuario(id) {
  try {
    console.log('Iniciando edição do usuário:', id);
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar usuário: ${response.status}`);
    }
    
    const usuario = await response.json();
    console.log('Dados do usuário recebidos:', usuario);

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Preencher o formulário
    document.getElementById("usuarioId").value = usuario.id;
    document.getElementById("nome").value = usuario.nome || '';
    document.getElementById("email").value = usuario.email || '';

    editando = true;
    document.getElementById("modalTitle").textContent = "Editar Usuário";
    
    // Abrir o modal
    const modalElement = document.getElementById("usuarioModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    console.log('Modal de edição aberto com sucesso');
  } catch (error) {
    console.error("Erro detalhado ao editar usuário:", error);
    alert(`Erro ao carregar dados do usuário: ${error.message}`);
  }
}

// Função para deletar um usuário
async function deletarUsuario(id) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir usuário: ${response.status}`);
      }

      console.log('Usuário excluído com sucesso');
      await carregarUsuarios();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert(`Erro ao excluir o usuário: ${error.message}`);
    }
  }
}

// Função para limpar o formulário
function limparFormulario() {
  document.getElementById("usuarioForm").reset();
  document.getElementById("usuarioId").value = "";
  editando = false;
  document.getElementById("modalTitle").textContent = "Novo Usuário";
}

// Limpar formulário quando o modal for fechado
document
  .getElementById("usuarioModal")
  .addEventListener("hidden.bs.modal", limparFormulario);
