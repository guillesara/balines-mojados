const config = require('../../../../config.json');
const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

module.exports = (router, database, mail) => 
{
    const usedTokens = new Set();

    router.get('/reserves/view/:id', async (req, res) => {
        if (!req.params.id) return res.redirect("/admin/reserves");

        const con = mysql.createConnection(database);
        
        try {
            const [results_reserves] = await con.promise().query('SELECT * FROM reserves WHERE id = ?', [req.params.id]);

            const [results_plans] = await con.promise().query('SELECT id, name FROM plans');
            const [results_rooms] = await con.promise().query('SELECT id, type, capacity FROM rooms');

            req.session.token = uuidv4();

            res.render('admin/dashboard', { content: 'modify-reserve', plans: results_plans, rooms: results_rooms, reserve: results_reserves[0] });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.post('/reserves/modify/:id', async (req, res) => {
        if (!req.params.id) return res.redirect("/admin/reserves");
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('admin/dashboard', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/reserves/view' + req.params.id
                }
            });
        } else { usedTokens.add(req.session.token); }

        const body = req.body;
        const userData = auth.getUser(functions.getCookie(req, 'token'));
        const con = mysql.createConnection(database);
        
        try {
            const [results_insert] = await con.promise().query('UPDATE reserves SET ? WHERE id = ?', [{admin: userData.id, room: body.room, plan: body.plan, date: body.date, time: body.time, players: body.players, name: body.name, lastname: body.lastname, phone: body.phone}, req.params.id]);

            const info = await mail.sendMail({   
                from: `Balines Mojados <${config.email.user}>`,  
                to: body.email,
                subject: `Reserva MODIFICADA`,
                text: `Hola ${body.name}.

                ¡Gracias por elegirnos para tu experiencia de paintball!
                
                Tu reserva ha sido modificada exitosamente. A continuación, te proporcionamos los detalles importantes de tu reserva:
                
                Código de reserva: ${results_insert.insertId}

                Te esperamos el ${body.date} a las ${body.time} para disfrutar de una emocionante partida de paintball.
                
                Saludos cordiales, Balines Mojados.`
            });

            res.render('admin/dashboard', { 
                alert: {
                    title: 'Success',
                    message: 'Reserva creada exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'admin/reserves/view' + req.params.id
                }
            });
        } catch (error) {
            console.error(error);
            
            res.render('admin/dashboard', { 
                alert: {
                    title: 'Error',
                    message: 'Server error',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/reserves/view' + req.params.id
                }
            });
        } finally {
            con.end();
        }
    });
}