const {getAsync} = require('../redis/index');

module.exports = async () => {
    let count;
    try {
      count = await getAsync("added_todos");
      count = Number(count);
      if(isNaN(count)) count = 0;
    } catch (error) {
        console.log(error);
      count = 0;
    }finally{
        return count;
    }
}