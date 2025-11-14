import Database from "better-sqlite3";

const db = new Database("./users.db");

// Enable foreign key constraints in SQLite
db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        middle_name TEXT,
        last_name TEXT NOT NULL,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        refresh_token TEXT
    )
`);

// Migration: Add refresh_token column if it doesn't exist (for existing databases)
try {
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const hasRefreshToken = tableInfo.some(column => column.name === 'refresh_token');
    
    if (!hasRefreshToken) {
        console.log("Adding refresh_token column to users table...");
        db.exec(`ALTER TABLE users ADD COLUMN refresh_token TEXT`);
    }
} catch (error) {
    console.error("Migration error:", error);
}

db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`);


export default db;