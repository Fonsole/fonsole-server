const SocketIO = require('socket.io');

const EVENT_CONNECTION = 'connection';
const MESSAGE_NAME = 'SMSG';
const SignalingMessageType = {
  Invalid: 0,
  Connected: 1,
  Closed: 2,
  UserMessage: 3,
  UserJoined: 4,
  UserLeft: 5,
  OpenRoom: 6,
  JoinRoom: 7,
  GameStarted: 8,
  RoomNamesDiscovered: 9,
};

// here we keep track of the rooms
const gRooms = {};

class SMessage {
  constructor(lMsgType, lMsgContent, lUserId) {
    this.type = lMsgType;
    this.content = lMsgContent;
    this.id = lUserId;
  }
}

class Room {
  constructor(lName) {
    this.mName = lName;
    this.mConnection = {};

    // add to the global room list
    gRooms[lName] = this;
  }

  getName() {
    return this.mName;
  }

  addConnection(lConnection) {
    this.sendUserJoined(lConnection);
    this.mConnection[lConnection.getId()] = lConnection;
  }

  remConnection(lConnection) {
    console.log('send user left message');
    delete this.mConnection[lConnection.getId()];
    this.sendUserLeft(lConnection);
  }

  close() {
    Object.values(this.mConnection).forEach(connection => connection.disconnect());

    // remove from roomlist
    delete gRooms[this.mName];

    console.log(`Room ${this.mName} closed`);
  }

  sendUserMessage(lFrom, lContent, lTo) {
    const lMsgObj = new SMessage(SignalingMessageType.UserMessage, lContent, lFrom.getId());
    if (typeof lTo !== 'undefined' && lTo !== null && lTo !== -1) {
      this.mConnection[lTo].emit(MESSAGE_NAME, lMsgObj);
    } else {
      this.sendEveryone(lMsgObj);
    }
  }

  sendUserJoined(lConnection) {
    const lMsgObj = new SMessage(SignalingMessageType.UserJoined, '', lConnection.getId());
    this.sendEveryone(lMsgObj);
  }

  sendUserLeft(lConnection) {
    const lMsgObj = new SMessage(SignalingMessageType.UserLeft, '', lConnection.getId());
    this.sendEveryone(lMsgObj);
  }

  sendEveryone(lMsgObj) {
    Object.values(this.mConnection).forEach(connection => connection.emit(MESSAGE_NAME, lMsgObj));
  }
}

class Connection {
  constructor(lId) {
    this.mConnecting = true;
    this.mRoomOwner = false;
    // socket.io connection etablished but not yet joined or opened a room
    this.mOwnId = lId;
  }

  getId() {
    return this.mOwnId;
  }

  /**
   * Called during socket.io connection event
   * 
   * @param {any} lSocket Socket
   */
  init(lSocket) {
    this.mSocket = lSocket;

    this.mSocket.on(MESSAGE_NAME, (lMsg) => {
      console.log(`REC: ${JSON.stringify(lMsg)}`);
      switch (lMsg.type) {
        case SignalingMessageType.OpenRoom: {
          this.onOpenRoom(lMsg.content);
          break;
        }
        case SignalingMessageType.JoinRoom: {
          this.onJoinRoom(lMsg.content);
          break;
        }
        case SignalingMessageType.GameStarted: {
          this.onRoomNameDiscovery();
          break;
        }
        case SignalingMessageType.UserMessage: {
          this.onUserMessage(lMsg.content, lMsg.id);
          break;
        }
        default: {
          console.log(`Unknown message: ${JSON.stringify(lMsg)}`);
        }
      }
    });

    // disconnect event
    this.mSocket.on('disconnect', () => {
      this.onDisconnect();
    });
  }

  /**
   * Called if the connection is in a room that is closed.
   */
  disconnect() {
    this.mSocket.disconnect();
  }

  emit(lType, lMsg) {
    this.mSocket.emit(lType, lMsg);
  }

  onOpenRoom(lRoomName) {
    console.log(`Try to open room ${lRoomName}`);
    this.mConnecting = false;

    // room name still free? 
    if (!(lRoomName in gRooms)) {
      this.mRoomOwner = true;

      // open the room
      this.mRoom = new Room(lRoomName);
      this.mRoom.addConnection(this);


      console.log(`room opened: ${lRoomName}`);

      const roomName = this.mRoom.getName();
      const lMsgObj = new SMessage(SignalingMessageType.Connected, roomName, this.mOwnId);
      this.mSocket.emit(MESSAGE_NAME, lMsgObj);
      console.log(`SND: ${JSON.stringify(lMsgObj)}`);
    } else {
      // disconnect the user if it failed
      this.mSocket.disconnect();
    }
  }

  onJoinRoom(lRoomName) {
    this.mConnecting = false;
    // does the room exist?
    if (lRoomName in gRooms) {
      this.mRoomOwner = false;
      this.mRoom = gRooms[lRoomName];
      // join the room
      this.mRoom.addConnection(this);

      console.log(`user ${this.mOwnId} joined room: ${lRoomName}`);

      const roomName = this.mRoom.getName();
      const lMsgObj = new SMessage(SignalingMessageType.Connected, roomName, this.mOwnId);
      this.mSocket.emit(MESSAGE_NAME, lMsgObj);
      console.log(`SND: ${JSON.stringify(lMsgObj)}`);
    } else {
      console.log(`user ${this.mOwnId} will be disconnected. Room ${lRoomName} unknown`);
      // disconnect the user if it failed
      this.mSocket.disconnect();
    }
  }

  onUserMessage(lContent, lTo) {
    // check if user is actually in a room 
    if (this.mRoom != null) {
      this.mRoom.sendUserMessage(this, lContent, lTo);
    }
  }

  onDisconnect() {
    if (this.mRoom != null) {
      if (this.mRoomOwner) {
        console.log(`Room owner ${this.mOwnId} disconnecting. Closing room `);
        this.mRoom.remConnection(this);
        this.mRoom.close();
      } else {
        console.log(`user ${this.mOwnId} disconnecting`);
        this.mRoom.remConnection(this);
      }
    }

    console.log(`user ${this.mOwnId} disconnected`);
  }

  onRoomNameDiscovery() {
    const names = Object.keys(gRooms);

    const lMsgObj = new SMessage(SignalingMessageType.RoomNamesDiscovered, names.join(','), this.mOwnId);
    this.mSocket.emit(MESSAGE_NAME, lMsgObj);
  }
}

module.exports = class Netgroup {
  constructor() {
    // counter for connections (not concurrent!)
    this.connectionCount = 0;
  }

  listen(lHttpOrPort) {
    this.io = new SocketIO(lHttpOrPort);

    // wait for connections via socket.io.
    // if a connection is etablished setup all the handlers for messages
    this.io.on(EVENT_CONNECTION, (lSocket) => {
      this.connectionCount += 1;
      console.log(`a user ${this.connectionCount} connected`);
      const connection = new Connection(this.connectionCount);
      connection.init(lSocket);
    });
  }
};
