import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const db = new pg.Pool({
    connectionString: process.env.DB_CONN_STRING
});

db.query(`
    INSERT INTO chatroom 
    (username, msg_content, user_colour, likes) 
    VALUES ($1,$2,$3,$4)`,
    ['🦥 Cxndr', 'initial test message', '#65C8BC', '0']
);

db.query(`
    INSERT INTO chatroom 
    (username, msg_content, user_colour, likes) 
    VALUES ($1,$2,$3,$4)`,
    ['🦥 Cxndr', 'initial test message 2', '#33CCCC', '0']
);

db.query(`
    INSERT INTO chatroom 
    (username, msg_content, user_colour, likes) 
    VALUES ($1,$2,$3,$4)`,
    ['Test User', 'hey 🙂', '#C13333', '11']
);

db.query(`
    INSERT INTO chatroom 
    (username, msg_content, user_colour, likes) 
    VALUES ($1,$2,$3,$4)`,
    ['Ghost 👻', '.....', '#FFFFFF', '0']
);

db.query(`
    INSERT INTO chatroom 
    (username, msg_content, user_colour, likes) 
    VALUES ($1,$2,$3,$4)`,
    ['🥷', '', '#000000', '99']
);

db.query(`
    INSERT INTO chatroom 
    (username, msg_content, user_colour, likes) 
    VALUES ($1,$2,$3,$4)`,
    ['👤 anon', 'this is a message from an anonymous user who has not set a username, or has left their username blank', '#33CCCC', '0']
);

db.query(`
    INSERT INTO chatroom 
    (username, msg_content, user_colour, likes) 
    VALUES ($1,$2,$3,$4)`,
    ['Test User 13', 'another test message', '#33CC61', '0']
);

db.query(`
    INSERT INTO chatroom 
    (username, msg_content, user_colour, likes) 
    VALUES ($1,$2,$3,$4)`,
    ['Test User 13', 'qweqweqewqweqweqweqweqew', '#33CC61', '0']
);



