const PeticaoModel = require("../models/peticaoModels");
const Joi = require('joi');
const autenticacao = require("../../config/autenticacao");
const { ObjectId } = require("mongodb")
const jwt = require('jsonwebtoken');

const token = (params = {}) => {
   return jwt.sign(params, "secret", {
     expiresIn: 10000
   });
}

module.exports = class peticaoController {

   static async getPeticao(req, res, next) {
      console.log('[Peticao Controller] getPeticao');
      try {
         const Peticao = await PeticaoModel.getPeticao();
         if (!Peticao) {
            res.status(404).json(`Não existe peticao cadastrado.`);
         }
         Peticao.forEach(Peticao => {
            console.log(`[Peticao controller: retorno do banco] ${Peticao.name}`);
         });
         res.status(200).json(Peticao);
      } catch (error) {
         console.log(`[Peticao Controller Error] ${error}`);
         res.status(500).json({ error: error })
      }
   }

   static async addPeticao(req, res, next) {
      const validate = autenticacao(req, res, next);
      if (validate) return validate
      const user = req.user.id


      const schema = Joi.object({
         titulo: Joi.string().min(3).max(50).required(),
         descricao: Joi.string().min(3).max(50).required()
      })

      const result = schema.validate(req.body)
      if (result.error) return res.status(400).send(result.error.details[0].message)

      const Peticao = {
         titulo: req.body.titulo,
         descricao: req.body.descricao,
         usuario: ObjectId(user),
         data: new Date(),
         lista: []
      }

      try {
         const addedPeticao = await PeticaoModel.addPeticao(Peticao)
         res.status(200).json(addedPeticao)
      } catch (error) {
         res.status(500).json({ error })
      }
   }

   static async updatePeticao(req, res, next) {
      const validate = autenticacao(req, res, next);
      if (validate) return validate
      const user = req.user.id
      
      const schema = Joi.object({
         titulo: Joi.string().min(3).max(50).required(),
         descricao: Joi.string().min(3).max(50).required()
      })

      const result = schema.validate(req.body)
      if (result.error) return res.status(400).send(result.error.details[0].message)

      const id = req.params.id;
      const Peticao = {
         titulo: req.body.titulo,
         descricao: req.body.descricao
      }

      try {
         const peticoes = await PeticaoModel.getPeticao()
         for(var i = 0; i< peticoes.length; i++){
            if(peticoes[i].usuario == user && peticoes[i]._id.toString() == id){
               const update = await PeticaoModel.updatePeticao(Peticao, id)
               if (update.modifiedCount === 0)return res.status(400).json('Peticao not found')
               return res.status(200).json({mensagem: 'peticao editada'})
            }
         }
         return res.status(400).json("Voce não é o autor da petição!")
      } catch (error) {
         return res.status(500).json({ error })
      }
   }

   static async deletePeticao(req, res, next) {
      console.log('[Delete Peticao Controller]');
      const validate = autenticacao(req, res, next);
      if (validate) return validate
      const user = req.user.id
      const id = req.params.id;

      try {
         const peticoes = await PeticaoModel.getPeticao()
         for(var i = 0; i< peticoes.length; i++){
            if(peticoes[i].usuario == user && peticoes[i]._id.toString() == id){
               const deletado = await PeticaoModel.deletePeticao(id)
               if (deletado.deletedCount === 0)return res.status(400).json('Peticao not found')
               return res.status(200).json({mensagem: 'peticao deletada'})
            }
         }
         return res.status(400).json("Voce não é o autor da petição!")

      } catch (error) {
         res.status(500).json({ error })
      }
   }
   static async addUsuario(req, res, next) {

      try {
         const schema = Joi.object({
            nome: Joi.string().min(3).max(50).required(),
            email: Joi.string().min(3).max(50).required(),
            senha: Joi.string().min(3).max(50).required()
         });
         const result = schema.validate(req.body)
         if (result.error) return res.status(400).send(result.error.details[0].message)

         const usuario = {
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
         }
         const resposta = await PeticaoModel.addUsuario(usuario)
         console.log(resposta.insertedId.toString())
         return res.status(200).json({token: token({id: resposta.insertedId.toString()})})
      } catch (error) {
         res.status(500).json({ error })
      }
   }
   static async addAutenticacao(req, res, next) {

      try {
         const schema = Joi.object({
            email: Joi.string().min(3).max(50).required(),
            senha: Joi.string().min(3).max(50).required()
         });
         const result = schema.validate(req.body)
         if (result.error) return res.status(400).send(result.error.details[0].message)
         const autenticacao = {
            email: req.body.email,
            senha: req.body.senha
         }
         const resposta = await PeticaoModel.addAutenticacao(autenticacao)
         if(!resposta) return res.status(400).json("Falha ao autenticar")
         return res.status(200).json({token: token({id: resposta._id})})
      } catch (error) {
         res.status(500).json({ error })
      }
   }
   static async addAssinatura(req, res, next) {
      const validate = autenticacao(req, res, next);
      if (validate) return validate
      const user = req.user.id
      const id = req.params.id;

      try {
         const peticoes = await PeticaoModel.getPeticao()
         for(var i = 0; i< peticoes.length; i++){
            if(peticoes[i].usuario != user && peticoes[i]._id.toString() == id){
               peticoes[i].lista.forEach((assinatura)=> {
                  if(assinatura == user){
                     return res.status(400).json({mensagem: 'peticao já assinada'})
                  }
               })
               const atualizado = [...peticoes[i].lista, user]
               const peticao = {
                  ...peticoes[i], 
                  lista: atualizado
               }
               await PeticaoModel.updatePeticao(peticao, id)
               return res.status(200).json({mensagem: 'peticao assinada'})
            }
         }
         return res.status(400).json("Voce não pode assinar sua propria petição!")
         
      } catch (error) {
         res.status(500).json({ error })
      }
   }

   
}