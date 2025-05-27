import express from 'express'
import db from './db.js'

const router = express.Router()

//#region ROTAS USUÁRIO

//#region CREATE USUÁRIO
router.post("/usuario", async (req, res) => {
    try {
        console.log("Body recebido:", req.body); // Adicionei este console.log
        const { nome_usuario, sobrenome_usuario, telefone, email, cpf, senha } = req.body;

        if (!nome_usuario || !sobrenome_usuario || !telefone || !email || !cpf || !senha) {
            return res.status(400).json({ error: "O usuário não preencheu todas as informações necessárias. Por favor, revise o formulário" });
        }

        const [userExistente] = await db.execute("SELECT * FROM usuario WHERE email = ?", [email]);

        if (userExistente.length > 0) {
            return res.status(409).json({ error: "E-mail já cadastrado. Tente outro." });
        }

        const [result] = await db.execute(
            "INSERT INTO usuario(nome_usuario, sobrenome_usuario, telefone, email, cpf, senha) VALUES (?, ?, ?, ?, ?, ?)",
            [nome_usuario, sobrenome_usuario, telefone, email, cpf, senha]
        );
        res.json({ id: result.insertId, nome_usuario, sobrenome_usuario, telefone, email, cpf, senha });
    } catch (error) {
        console.error("Erro no backend:", error.message);
        res.status(500).json({ error: error.message });
    }
});

//#endregion

//#region CREATE ADM
router.post("/admin", async (req, res) => {
    try {
        console.log("Body recebido:", req.body);

        // ✅ Desestruturação dos dados
        const { 
            nome_adm,
            sobrenome_adm,
            email_adm,
            cpf_adm,
            atuacao_adm,
            cargo_adm,
            nome_empresa,
            cnpj,
            cep_empresa,
            senha 
        } = req.body;

        // ✅ Verificação se todos os campos foram preenchidos
        if (
            !nome_adm || !sobrenome_adm || !email_adm || !cpf_adm ||
            !atuacao_adm || !cargo_adm || !nome_empresa ||
            !cnpj || !cep_empresa || !senha
        ) {
            return res.status(400).json({ error: "Preencha todas as informações necessárias." });
        }

        // ✅ Verificação de duplicidade: email, cpf, cnpj, cep
        const [admExistente] = await db.execute(
            "SELECT * FROM adm WHERE email_adm = ? OR cpf_adm = ? OR cnpj = ? OR cep_empresa = ?",
            [email_adm, cpf_adm, cnpj, cep_empresa]
        );

        if (admExistente.length > 0) {
            return res.status(409).json({ error: "Dados duplicados. Verifique e-mail, CPF, CNPJ e CEP." });
        }

        // ✅ Inserção no banco de dados
        const [result] = await db.execute(
            "INSERT INTO adm (nome_adm, sobrenome_adm, email_adm, cpf_adm, atuacao_adm, cargo_adm, nome_empresa, cnpj, cep_empresa, senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [nome_adm, sobrenome_adm, email_adm, cpf_adm, atuacao_adm, cargo_adm, nome_empresa, cnpj, cep_empresa, senha]
        );

        // ✅ Retorno de sucesso
        res.status(201).json({ 
            id: result.insertId,
            nome_adm,
            sobrenome_adm,
            email_adm,
            cpf_adm,
            atuacao_adm,
            cargo_adm,
            nome_empresa,
            cnpj,
            cep_empresa,
            senha
        });
    } catch (error) {
        console.error("Erro no backend:", error.message);
        res.status(500).json({ error: error.message });
    }
});
//#endregion

//#region READ USUÁRIO
router.get("/usuario", async (req, res) => { //trocar app por router
    try {
        const [usuario] = await db.execute("SELECT * FROM usuario")
        res.status(200).json(usuario) //Inserir essa linha
    } catch (error) {
        console.error("Erro ao buscar itens:", error)
        res.status(500).json({ error: error.message })
    }
})
//#endregion

//#region AUTENTICAR USUÁRIO
router.post("/usuario/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: "Preencha todos os campos." });
        }

        // Verifica se o usuário existe no banco de dados
        const [rows] = await db.execute("SELECT * FROM usuario WHERE email=? AND senha=?", [email, senha]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        const usuario = rows[0];
        res.status(200).json({ message: "Login realizado com sucesso!", usuario });
    } catch (error) {
        console.error("Erro no login:", error.message);
        res.status(500).json({ error: error.message });
    }
});
//#endregion

//#region UPDATE USUÁRIO
router.put("/usuario/:id", async (req, res) => { //trocar app por router
    try {
        const { id } = req.params
        const { nome_usuario, sobrenome_usuario, telefone, email, cpf, senha } = req.body
        await db.execute("UPDATE usuario SET nome_usuario=?, sobrenome_usuario=?, telefone=?, email=?, cpf=?, senha=? WHERE id=?", [
            nome_usuario,
            sobrenome_usuario,
            telefone,
            email,
            cpf,
            senha,
            id,
        ])
        res.json({ message: "Item atualizado com sucesso!" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
//#endregion

//#region DELETE USUÁRIO
router.delete("/usuario/:id", async (req, res) => { //trocar app por router
    try {
        const { id } = req.params
        await db.execute("DELETE FROM usuario WHERE id=?", [id])
        res.json({ message: "Item excluído com sucesso!" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
//#endregion

//#endregion

console.log("Rota criada")
export default router