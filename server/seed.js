import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const db = new pg.Pool({
    connectionString: process.env.DB_CONN_STRING
});

db.query(`INSERT INTO chatroom (username, msg_content, user_colour) VALUES ($1,$2,$3)`,['Cxndr', 'initial test message', '#33CCCC'])
db.query(`INSERT INTO chatroom (username, msg_content, user_colour) VALUES ($1,$2,$3)`,['Cxndr', 'initial test message 2...', '#33CCCC'])