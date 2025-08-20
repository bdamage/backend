const Counter = require("../model/Counter");

const getNextSequence = async (_name) => {
  try {
    const ret = await Counter.findOneAndUpdate(
      { name: _name },
      { $inc: { seq: 1 } },
      { new: true }
    );

    if (ret === null) {
      const ret = await Counter.create({ name: _name, seq: 0 });
      return ret.seq;
    }

    return ret.seq;
  } catch (err) {
    console.log(err);
  }

  console.log(ret);
  return -1;
};

module.exports = { getNextSequence };
