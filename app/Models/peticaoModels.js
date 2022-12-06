const client = require('../../config/dbConnection');
const { ObjectId } = require("mongodb")
module.exports = class PeticaoModel {

    static async getPeticao() {
        console.log(`[getallPeticao]`);
        const cursor = await client.db("peticao").collection("peticoes").find();
        const Peticao = await cursor.toArray();
        return Peticao;
    }

    static async addPeticao(data) {
        const Peticao = await this.getPeticao();

        try {
            const newPeticao = {
                titulo: data.titulo,
                descricao: data.descricao,
                usuario: data.usuario,
                data: new Date(),
                lista: data.lista
            }
            const addedPeticao = await client.db("peticao").collection("peticoes").insertOne(newPeticao);
            console.log(`New Peticao inserted with the following id ${addedPeticao.insertedId}`);
            
            return addedPeticao;
        } catch (error) {
            console.log(`[PeticaoService] Error: ${error}`);
        }
    }

    static async updatePeticao(data, id) {
        try {
            const updatedPeticao = {...data}

            const update = await client.db("peticao").collection("peticoes").updateOne(
                { _id: ObjectId(id) },
                { $set: updatedPeticao }
            )
            
            return update;
        } catch (error) {
            console.log(`[Peticaoervice] Error: ${error}`);
        }
    }

    static async deletePeticao(id) {
        try {
            const deletePeticao = await client.db("peticao").collection("peticoes").deleteOne(
                { _id: ObjectId(id) }
            )
                        
            return deletePeticao;
        } catch (error) {
            console.log(`[Peticaoervice] Error: ${error}`);
        }
    }
    static async addUsuario(data) {
        try {
            const addedUsuario = await client.db("peticao").collection("usuario").insertOne(data);
            
            return addedUsuario;
        } catch (error) {
            console.log(`[UsuarioService] Error: ${error}`);
        }
    }
    static async addAutenticacao(autenticacao) {
        try {
            const addedAutenticacao = await client.db("peticao").collection("usuario").findOne(
                {
                    email: autenticacao.email, 
                    senha: autenticacao.senha
                })
                console.log(addedAutenticacao)
            
            return addedAutenticacao;
        } catch (error) {
            console.log(`[AutenticacaoService] Error: ${error}`);
        }
    }
    
}