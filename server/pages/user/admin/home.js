const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/', async (req, res) => {
        const con = mysql.createConnection(database);
        
        try {
            const [results_data] = await con.promise().query('SELECT (SELECT COUNT(id) FROM users) AS \'users\', COUNT(r.id) AS \'reserves\', COUNT(r.id)*p.price AS \'sells\' FROM reserves r JOIN plans p ON p.id = r.plan WHERE `date` >= CURDATE();');
            const [results_reserves] = await con.promise().query('SELECT * FROM reserves');

            let data = { 
                users: results_data[0].users, 
                reserves: results_data[0].reserves,
                sells: results_data[0].sells ? results_data[0].sells.toLocaleString('es-ES') : 0
            }

            res.render('admin/dashboard', { content: 'home', data: data, reserves: results_reserves });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}