import http from "http";
import WebSocket from "ws";
import express from 'express';

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
function handleConnection(socket){
    console.log(socket)
}
wss.on("connection", handleConnection);
server.listen(3000, handleListen);

// console.log("hello")