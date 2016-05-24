var iot = require('../lib/').default;

var rsb = new iot('http://localhost:3030', "client")

rsb.on("connect", () => {
  console.log("connected");
  rsb.link("123").then((room) => {
    console.log("linked to "+room);
    rsb.send('test', {t: 'ok'}, room);
  }).catch((err) => {
    console.log("err");
  })
})

rsb.on('test', (d) => {
  console.log(d);
});

rsb.on("id", (id) => {
  console.log(id);
})
