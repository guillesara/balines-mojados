const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/reserves', async (req, res) => {
        const con = mysql.createConnection(database);

        try {
            const [results] = await con.promise().query('SELECT * FROM rooms');
            const [results2] = await con.promise().query('SELECT * FROM reserves WHERE date >= ');

            res.render('user/turnos', { rooms: results[0] }); 
        } catch (error) {
            console.log(error)
        } finally {
            con.end();
        }
    });
}