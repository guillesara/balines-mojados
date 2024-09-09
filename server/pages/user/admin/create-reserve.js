const config = require('../../../../config.json');
const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

module.exports = (router, database, mail) => 
{
    const usedTokens = new Set();

    router.get('/reserves/create', async (req, res) => {
        const con = mysql.createConnection(database);
        
        try {
            const [results_plans] = await con.promise().query('SELECT id, name FROM plans');
            const [results_rooms] = await con.promise().query('SELECT id, type, capacity FROM rooms');

            req.session.token = uuidv4();

            res.render('admin/dashboard', { content: 'create-reserve', plans: results_plans, rooms: results_rooms });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.post('/reserves/create', async (req, res) => {
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('admin/dashboard', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/reserves/create'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const body = req.body;
        const userData = auth.getUser(functions.getCookie(req, 'token'));
        const con = mysql.createConnection(database);
        
        try {
            const [results_insert] = await con.promise().query('INSERT INTO reserves SET ?', {admin: userData.id, room: body.room, plan: body.plan, date: body.date, time: body.time, players: body.players, name: body.name, lastname: body.lastname, phone: body.phone});

            const info = await mail.sendMail({   
                from: `Balines Mojados <${config.email.user}>`,  
                to: body.email,
                subject: `Reserva`,
                text: `Hola ${body.name}.

                ¡Gracias por elegirnos para tu experiencia de paintball!
                
                Tu reserva ha sido confirmada exitosamente. A continuación, te proporcionamos los detalles importantes de tu reserva:
                
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
                    ruta: 'admin/reserves/create'
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