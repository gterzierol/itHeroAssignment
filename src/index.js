//İlgili paketler projeye dahil edilir.

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const PORT = 5000;

//Connection için gerekli config sağlanmaktadır. Default olarak 3306 port'unda çalışmasından ötürü port değeri atanmamıştır.
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456.",
  database: "task",
});

app.use(bodyParser.json());

//ön endpoint sağlamak için fonksiyon tanımlanmıştır. Fonksiyon Name parametresi almaktadır. Bu parametre, get isteği atılırken post ile gönderilmiş olan name objesinden alınmaktadır.
function getEndpoint(name) {
  return "https://api.agify.io/?name=" + name;
}

//Post işlemi /addData route'unda gerçekleşmektedir. Buraya Name gönderilmektedir body'de (postmande sağlanmaktadır.)
app.post("/addData", async function (req, res) {
  let apiResponse;

  try {
    apiResponse = await axios.get(getEndpoint(req.body.name));
    const data = Object.assign(
      { createdDate: new Date().toISOString().slice(0, 19).replace("T", " ") },
      apiResponse.data
    );

    // MySQL bağlantısı sağlanır. bağlantı sağlanıp sağlanmadığı kontrol edilir.
    connection.connect(function (err) {
      if (err) throw err;
      console.log("connected");
      var sql = `INSERT INTO task.person (name, age, count, CreatedDate) VALUES ("${data.name}",${data.age},${data.count},"${data.createdDate}")`;
      connection.query(sql, function () {
        res.send({
          message: "Ekleme Başarılı",
          data: {
            name: data.name,
            age: data.age,
            count: data.count,
            createdDate: data.date,
          },
        });
        connection.end();
      });
    });
  } catch (error) {
    console.error(e);
    return res.status(500).send({ message: "error" });
  }
});

app.listen(PORT);
