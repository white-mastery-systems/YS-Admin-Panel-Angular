import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  constructor(private socket: Socket) {
    this.socket.on('deal_fulfilled', (data: any) => {
      console.log("----->>>>>>>", data);
    });
  }

  onCreateRoom(configData: any) {
    this.socket.emit('store_id', configData);
  }
  
}