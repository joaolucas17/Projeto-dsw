const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send({ error: 'No token provided' })
  }
  let err = null;
  let user;
  const parts = header.split(' '); 
  const [ scheme, token ] = parts; 
  jwt.verify(token, "secret", (error, decoded) => {
    if (error) {
      err = error
    }

    user = decoded;
  })

  if (err) {
    return res.status(401).send({ error: 'Invalid token' });
  } else {
    req.user = user;
  }
}