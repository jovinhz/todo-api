const fs = require('fs');

const aboutController = {
  index: async (req, res) => {
    fs.readFile('about.json', (err, buffer) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.status(200).send(JSON.parse(buffer.toString()));
    });
  }
};

module.exports = aboutController;
