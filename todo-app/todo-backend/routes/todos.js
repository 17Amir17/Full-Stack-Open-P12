const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { setAsync, getAsync } = require('../redis/index');
const getCount = require('../util/getCount');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  let count = await getCount();
  count ++;
  setAsync("added_todos", String(count));
  console.log(count);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.status(405).send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;
  const update = {}
  if(text) update.text = text;
  if(done) update.done = done;
  Todo.updateOne({_id: req.todo._id}, update, (err, updated) => {
    if(err) res.status(500);
    else res.status(405).send(updated);
  });
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
