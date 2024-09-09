const mysql = require('mysql2');

module.exports = (router, database, mail) => 
{
    router.get('/reserves', async (req, res) => {
        const con = mysql.createConnection(database);
        
        try {
            const [results_reserves] = await con.promise().query('SELECT id, name, lastname, date, time FROM reserves');

            res.render('admin/dashboard', { content: 'reserves', reserves: results_reserves });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}