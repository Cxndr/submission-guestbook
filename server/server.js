import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const db = new pg.Pool({
    connectionString: process.env.DB_CONN_STRING
});


app.get("/msg", async (request, response) => {
    const chatroomContent = await db.query("SELECT * FROM chatroom");
    response.json(chatroomContent.rows);
    console.log("get recieved");
});

app.post("/msg", async (request, response) => {
    console.log("request.body: ", request.body);
    if (request.body.username == "") { request.body.username = "anon"}
    const insertContent = await db.query(`INSERT INTO chatroom (username, msg_content, user_colour) VALUES ($1,$2,$3)`,[request.body.username, request.body.msg_content, request.body.user_colour])
    response.json(request.body);
});


app.listen(8080, () => console.log("server is listening on port 8080..."));