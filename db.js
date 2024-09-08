const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    } else {
        console.log("Database connected");
        db.run("PRAGMA foreign_keys=ON");

        const schemaPath = path.join(__dirname, 'database', 'db_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error executing schema:', err);
                process.exit(1);
            } else {
                console.log("Database schema initialized");
            }
        });
    }
});

module.exports = db;
