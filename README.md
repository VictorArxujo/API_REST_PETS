
- Sistema de Adoção de Pets

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

##  sobre o projeto

**API_Pets** é uma API RESTful desenvolvida como parte da **Capacitação Backend 2025.1**. O projeto simula um sistema completo para adoção de pets, permitindo que usuários se cadastrem, façam login, registrem seus pets para adoção e gerenciem o processo de agendamento e conclusão da adoção.

A API foi construída seguindo o padrão MVC (Model-View-Controller) e inclui um sistema de autenticação seguro baseado em tokens JWT (JSON Web Tokens).

---

## 🚀 Funcionalidades

- **Autenticação de Usuários:**
  - Cadastro de novos usuários com senha criptografada (bcrypt).
  - Login de usuários com geração de token de autenticação (JWT).
  - Verificação de usuário autenticado através do token.
- **Gerenciamento de Usuários (CRUD):**
  - Atualização dos dados do usuário (apenas pelo próprio usuário).
  - Exclusão da conta do usuário (apenas pelo próprio usuário).
  - Listagem e busca de usuários.
- **Gerenciamento de Pets (CRUD):**
  - Cadastro de novos pets, associando-os ao usuário logado.
  - Listagem de todos os pets disponíveis para adoção.
  - Listagem dos pets pertencentes ao usuário logado.
  - Atualização dos dados de um pet (apenas pelo dono).
  - Exclusão de um pet (apenas pelo dono).
- **Processo de Adoção:**
  - Rota para um usuário agendar uma visita para um pet (não pode ser o próprio dono).
  - Rota para o dono do pet concluir a adoção, tornando o pet indisponível.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js
- **Framework:** Express.js
- **Banco de Dados:** MongoDB (com MongoDB Atlas)
- **ODM (Object Data Modeling):** Mongoose
- **Autenticação:** JSON Web Token (jsonwebtoken)
- **Criptografia de Senhas:** bcrypt
- **Ambiente de Desenvolvimento:** Nodemon
- **Variáveis de Ambiente:** dotenv

---

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Crie o arquivo de variáveis de ambiente:**
    - Crie um arquivo chamado `.env` na raiz do projeto.
    - Adicione as seguintes variáveis, substituindo pelos seus valores:
      ```
      MONGO_URI=mongodb+srv://<user>:<password>@cluster-url.net/<database-name>?retryWrites=true&w=majority
      PORT=3000
      JWT_SECRET=suaChaveSecretaSuperSegura
      ```

4.  **Inicie o servidor:**
    ```bash
    npm start
    ```
    O servidor estará rodando em `http://localhost:3000`.

---

## Endpoints da API

A seguir estão as principais rotas disponíveis na API. Rotas marcadas com 🔒 requerem um token de autenticação no Header `Authorization`.

#### Usuários (`/users`)
- `POST /register`: Cadastra um novo usuário.
- `POST /login`: Autentica um usuário e retorna um token.
- `GET /checkuser` 🔒: Retorna os dados do usuário logado.
- `GET /:id` 🔒: Busca um usuário pelo seu ID.
- `PATCH /:id` 🔒: Atualiza os dados do usuário.
- `DELETE /:id` 🔒: Apaga o usuário.

#### Pets (`/pets`)
- `POST /create` 🔒: Cadastra um novo pet.
- `GET /`: Lista todos os pets disponíveis para adoção.
- `GET /mypets` 🔒: Lista os pets do usuário logado.
- `PATCH /:id` 🔒: Atualiza os dados de um pet.
- `DELETE /:id` 🔒: Apaga um pet.
- `PATCH /schedule/:id` 🔒: Agenda uma visita para um pet.
- `PATCH /conclude/:id` 🔒: Conclui a adoção de um pet.
