const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/reserves', async (req, res) => {
        if (!req.query || !req.query.id) return res.redirect("/");

        const con = mysql.createConnection(database);

        try {
            const [results_plans] = await con.promise().query('SELECT * FROM plans');
            const [results_rooms] = await con.promise().query('SELECT id, type FROM rooms');
            const [results_reserves] = await con.promise().query('SELECT re.date, re.time, re.players, ro.`type`, ro.capacity FROM reserves re JOIN rooms ro ON re.room = ro.id WHERE `date` >= CURDATE()');

            if (!results_plans.find(x => x.id == req.query.id)) return res.redirect("/");

            res.render('user/turnos', { plans: results_plans, rooms: results_rooms, reserves: results_reserves }); 
        } catch (error) {
            console.log(error)
        } finally {
            con.end();
        }
    });
    router.post('/reserves', async (req, res) => {
        const body = req.body;
        const con = mysql.createConnection(database);

        if (!body || !body.planId || !body.name || body.lastname || !body.phone || !body.players)
        {
            res.render("global/home", {
                alert: {
                    title: "Error",
                    message: "Incorrect data",
                    icon: "error",
                    showConfirmButton: true,
                    time: 5000,
                    ruta: body.planId ? `user/reserves?id=${body.planId}` : ""
                }
            });
            return;
        }

        try {
            const [results_plans] = await con.promise().query('SELECT * FROM plans');
            const [results_rooms] = await con.promise().query('SELECT id, type FROM rooms');
            const [results_reserves] = await con.promise().query('SELECT re.date, re.time, re.players, ro.`type`, ro.capacity FROM reserves re JOIN rooms ro ON re.room = ro.id WHERE `date` >= CURDATE()');

            if (!results_plans.find(x => x.id == req.query.id)) return res.redirect("/");

            res.render('user/turnos', { plans: results_plans, rooms: results_rooms, reserves: results_reserves }); 
        } catch (error) {
            console.log(error)
        } finally {
            con.end();
        }
    });
}