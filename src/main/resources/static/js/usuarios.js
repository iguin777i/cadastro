// URL base da API
const API_URL = "http://localhost:8080/usuarios";

// Variável para controlar se estamos editando ou criando
let editando = false;

// Carregar usuários ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarUsuarios);

// Função para carregar a lista de usuários
async function carregarUsuarios() {
  try {
    const response = await fetch(API_URL);
    const usuarios = await response.json();
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
    console.error("Erro ao carregar usuários:", error);
    alert("Erro ao carregar a lista de usuários!");
  }
}

// Função para salvar um usuário (criar ou atualizar)
async function salvarUsuario() {
  const usuarioId = document.getElementById("usuarioId").value;
  const usuario = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
  };

  try {
    const url = editando ? `${API_URL}/${usuarioId}` : API_URL;
    const method = editando ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("usuarioModal")
      );
      modal.hide();
      carregarUsuarios();
      limparFormulario();
    } else {
      const error = await response.json();
      alert(error.message || "Erro ao salvar o usuário!");
    }
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    alert("Erro ao salvar o usuário!");
  }
}

// Função para editar um usuário
async function editarUsuario(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const usuario = await response.json();

    document.getElementById("usuarioId").value = usuario.id;
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;

    editando = true;
    document.getElementById("modalTitle").textContent = "Editar Usuário";
    const modal = new bootstrap.Modal(document.getElementById("usuarioModal"));
    modal.show();
  } catch (error) {
    console.error("Erro ao carregar usuário para edição:", error);
    alert("Erro ao carregar dados do usuário!");
  }
}

// Função para deletar um usuário
async function deletarUsuario(id) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        carregarUsuarios();
      } else {
        alert("Erro ao excluir o usuário!");
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert("Erro ao excluir o usuário!");
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
