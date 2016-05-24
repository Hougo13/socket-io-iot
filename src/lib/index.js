import io from 'socket.io-client';
import events from 'events';

export default class extends events {

  constructor(url, model, id) {
    super();
    this.url = url;
    this.model = model;
    this.id = id;
    this.connected = false;
    this.socket = io(url);
    this.socket.on('connect', () => {
      this.identify().then(() => {
        this.connected = true;
        this.emit('connect');
      }).catch((err) => {
        this.emit('error', 'Identification error');
      });
    });
    this.socket.on('disconnect', () => {
      this.connected = false;
      this.emit('disconnect');
    });
    this.socket.on('update', (req) => {
      this.update(req);
    });
  }

  identify() {
    return new Promise((resolve, reject) => {
      let params = {model: this.model, id: this.id};
      this.socket.emit('identify', params);
      this.socket.once('identify', (msg) => {
        if (!msg.error) {
          if (msg.new) {
            this.id = msg.id;
            this.emit('id', this.id);
          }
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  send(e, d, to) {
    let params = {e, d, to};
    this.socket.emit('update', params);
  }

  open(pin) {
    return new Promise((resolve, reject) => {
      this.socket.emit('open', pin);
      this.socket.once('open', (res) => {
        if (res == true) {
          resolve()
        } else {
          reject()
        }
      });
    });
  }

  link(pin) {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        this.socket.emit('link', pin);
        this.socket.once('link', (res) => {
          if (res) {
            resolve(res);
          } else {
            reject(res);
          }
        });
      } else {
        reject()
      }
    });
  }

  update(params) {
    this.emit(params.e, params.d)
  }
}
