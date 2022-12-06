const app = require('./config/server');
const routes = require('./app/Routes/peticaoRoutes');
// require('./startup/prod')(app)

routes.getPeticao(app);
routes.addPeticao(app);
routes.updatePeticao(app);
routes.deletePeticao(app);
routes.addUsuario(app);
routes.addAutenticacao(app);
routes.addAssinatura(app);
module.exports = app