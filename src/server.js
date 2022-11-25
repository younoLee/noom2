import express from 'express';

const app = express();
const handleListen = () => console.log("listening on http://localhost:3000");
app.listen(3000, handleListen);

// console.log("hello")