const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

const mysql = require('mysql2');
const { Preference } = require('mercadopago');

module.exports = (router, database, mp) => 
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
        const userData = auth.getUser(functions.getCookie(req, 'token'));

        const inputDate = new Date(body.date);
        const today = new Date();
        const oneMonthLater = new Date();
        
        inputDate.setDate(inputDate.getDate() + 1)
        oneMonthLater.setMonth(today.getMonth() + 1);
        
        const [hour, minute] = body.time ? body.time.split(':').map(Number) : [null, null];
        const startHour = 8;
        const endHour = 17;

        if (
            (!body.name || !body.lastname || !body.phone || !body.players || !body.date || !body.planId || !body.time) ||
            (inputDate < today || inputDate > oneMonthLater) ||                       
            (hour < startHour || hour > endHour || (hour === endHour && minute > 0))
        ) {
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

        const con = mysql.createConnection(database);

        try {
            const [results_user] = await con.promise().query('SELECT * FROM users WHERE ?', [userData.id]);
            const [results_plans] = await con.promise().query('SELECT * FROM plans');
            const [results_rooms] = await con.promise().query('SELECT type, capacity FROM rooms GROUP BY type');
            const [results_reserves] = await con.promise().query('SELECT re.date, re.time, re.players, ro.`type`, ro.capacity FROM reserves re JOIN rooms ro ON re.room = ro.id WHERE `date` >= CURDATE()');

            let plan = results_plans.find(x => x.id == body.planId);
            let room = results_rooms.find(x => x.type == body.type);
            console.log(room, plan )
            if (
                (!plan) ||
                (!room || body.players > room.capacity)
            ) {
                res.render("global/home", {
                    alert: {
                        title: "Error",
                        message: "Incorrect data 2",
                        icon: "error",
                        showConfirmButton: true,
                        time: 5000,
                        ruta: body.planId ? `user/reserves?id=${body.planId}` : ""
                    }
                });
                return;
            }

            //res.render('user/turnos', { plans: results_plans, rooms: results_rooms, reserves: results_reserves }); 

            const preference = new Preference(mp);

            preference.create({
                body: {
                    payer: {
                        name: body.name,
                        lastname: body.lastname,
                        email: results_user[0].mail,
                        phone: {
                            area_code: "54",
                            number: body.phone
                        }
                    },
                    back_urls: {
                        success: "http://localhost/reserve_success",
                        pending: "http://localhost/reserve_pending",
                        failure: "http://localhost/reserve_failure"
                    },
                    payment_methods: {
                        excluded_payment_methods: [],
                        excluded_payment_types: [
                            {
                                id: "ticket"
                            }
                        ],
                        installments: 1
                    },
                    items: [
                        {
                            title: 'Pack ' + plan.name,
                            quantity: 1,
                            unit_price: 2000
                        }
                    ],
                }
            })
            .then(console.log)
            .catch(console.log);

            res.send("xd")
        } catch (error) {
            console.log(error)
        } finally {
            con.end();
        }
    });
    router.post('/reserve_success', async (req, res) => {
    });
}