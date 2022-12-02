import http from "http";
import WebSocket from "ws";
import express from 'express';
import { type } from "os";

const app = express();
app.set("view engine","pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("listening on http://localhost:3000");
// app.listen(3000, handleListen);
const server = http.createServer(app);
// Node.js에 기본으로 내장된 Http 패키지를 사용해서 express로 만든 서버 애플리케이션 제공
const wss = new WebSocket.Server({ server });
// 웹 소켓 서버를 생성하면서 여기에 HTTP서버를 전당
/*function handleConnection(socket){
    console.log(socket)
}
//wss의 on메소드에서 전달한 socket를 받기위해  매개변수(socket)를 정의함.
//socket-> 사용자와 서버  사이의 연결 또는 그에대한 정보를 의미
//consloe.log(socket)-> socket의 내용 확인
wss.on("connection", handleConnection);*/
//웹소켓 서버 wss의 on 메소드-> "connection" 이벤트 발생시 -> 공백함수 handleConnection 호출
//on 메소드는 롤백함수에 spcket를 전달

const sockets = [];

wss.on("connection",(socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous"
    console.log("connected to Browser")
    socket.on("close", ()=> console.log("Disconnected from the Server"))
    socket.on("message",(msg)=>{
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach(asocket => asocket.send(`${socket.nickname}:${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        };
    });
});
// console.log("hello")
server.listen(3000, handleListen);