var iot = require('../lib/').default;

var rsb = new iot('http://localhost:3030', "server")

rsb.on("connect", () => {
  console.log("connected");
  rsb.open("123").then(() => {
    console.log("123 open");
  }).catch((err) => {
    console.log("err");
  })
})

rsb.on('test', (d) => {
  rsb.send('test', d);
  console.log(d);
});

rsb.on("id", (id) => {
  console.log(id);
})
