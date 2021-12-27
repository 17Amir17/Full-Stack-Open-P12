const express = require('express');
const redis = require('../redis')
const router = express.Router();
const getCount = require('../util/getCount');

const configs = require('../util/config')

let visits = 0

router.get('/statistics', async (_req, res) => {
  try {
    const count = await getCount();
    res.json({added_todos: count});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

module.exports = router;
