const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/reservas', async (req, res) => {
        res.render('user/turnos', {});

        // const con = mysql.createConnection(database);

        // try {
        //     const [results] = await con.promise().query('');

        //     res.render('dashboard/dashboard', { content: 'home', data: results[0] }); 
        // } catch (error) {
        //     console.log(error)
        // } finally {
        //     con.end();
        // }
    });
}