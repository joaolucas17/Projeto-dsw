const peticaoController = require("../controllers/peticaoControllers");

module.exports = {
  getPeticao: (app) => {
    app.get('/api/peticao', peticaoController.getPeticao);
  },
  
  addPeticao: (app) => {
    app.post('/api/peticao', peticaoController.addPeticao);
  },

  updatePeticao: (app) => {
    app.put('/api/peticao/:id', peticaoController.updatePeticao);
  },

  deletePeticao: (app) => {
    app.delete('/api/peticao/:id', peticaoController.deletePeticao);
  },
  addUsuario: (app) => {
    app.post('/api/usuario', peticaoController.addUsuario);
  },
  addAutenticacao: (app) => {
    app.post('/api/autenticacao', peticaoController.addAutenticacao);
  },
  addAssinatura: (app) => {
    app.post('/api/assinatura/:id', peticaoController.addAssinatura);
  },

}