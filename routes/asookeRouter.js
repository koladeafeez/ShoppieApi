/* eslint-disable no-param-reassign */
const express = require('express');
const asookesController = require('../controllers/asookeController');

function routes(Asooke) {
  const asookesRouter = express.Router();
  const controller = asookesController(Asooke);
  asookesRouter.route('/')
    .get(controller.get)
  

    
asookesRouter.use('/:id', (req, res, next) => {
  Asooke.findById(req.params.id,(err, asooke) => {
      if(err){
        return res.status(400).send(err)
      }
      if(asooke){
          req.asooke = asooke;
          return next();
      }
       return res.sendStatus(404);
  });  
})

asookesRouter.route('/:id')
.get((req, res) => {   
  res.json(req.asooke);
})
.patch((req, res) => {
  const {asooke}= req;
  if(req.body._id){
      delete req.body._id;
  }
  Object.entries(req.body).forEach(item => {
      const key = item[0];
      const value = item[1];
      asooke[key] = value;
  });
  req.jogger.save((err) => {
      if(err){
          return res.send(err);
      }
      return res.json(asooke);
  })

})



  return asookesRouter;
}

module.exports = routes;
