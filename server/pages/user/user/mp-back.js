const config = require('../../../../config.json');

const mysql = require('mysql2');
const { Payment } = require('mercadopago');

module.exports = (router, database, mp, mail) => 
{
    router.get('/mp/back', async (req, res) => {
        res.render('user/mp-back', {});
    });

    router.post('/mp/status', async (req, res) => {
        const query = req.body;
        if (!query.payment_id) res.json({status: true, title: "Error", description: "El id de pago no se encontro."});
        
        const con = mysql.createConnection(database);
        const payment = new Payment(mp);
        
        try {
            const [results_reserves] = await con.promise().query('SELECT payment_id FROM reserves WHERE payment_id = ?', [query.payment_id]);
            if (results_reserves[0]) return res.json({status: false, title: "Error en el pago", description: "Este pago ya se realizo."});

            const curPayment = await payment.get({id: query.payment_id});
            if (curPayment.status !== 'approved') return res.json({status: false, title: "Error en el pago", description: "El pago no fue aprobado."});

            const metadata = curPayment.metadata;
            const [results_insert] = await con.promise().query('INSERT INTO reserves SET ?', {payment_id: query.payment_id, user: metadata.user_id, room: metadata.room_id, plan: metadata.plan_id, date: metadata.date, time: metadata.time, players: metadata.players, name: metadata.first_name, lastname: metadata.last_name, phone: metadata.phone});

            const info = await mail.sendMail({   
                from: `Balines Mojados <${config.email.user}>`,  
                to: metadata.email,
                subject: `Reserva`,
                text: `Hola ${metadata.first_name}.

                ¡Gracias por elegirnos para tu experiencia de paintball!
                
                Tu reserva ha sido confirmada exitosamente. A continuación, te proporcionamos los detalles importantes de tu reserva:
                
                Código de reserva: ${results_insert.insertId}
                Código de pago: ${query.payment_id}

                Te esperamos el ${metadata.date} a las ${metadata.time} para disfrutar de una emocionante partida de paintball.
                
                Saludos cordiales, Balines Mojados.`
            });

            res.json({status: true, title: "¡Gracias por su compra!", description: "Le informamos que hemos enviado el codigo de reserva a su dirección de correo electrónico. Por favor, revise su bandeja de entrada y carpeta de spam en caso de no recibirlos. Si tiene alguna pregunta o necesita ayuda adicional, no dude en ponerse en contacto con nosotros. ¡Esperamos que disfrute su juego!"});
        } catch (error) {
            console.log(error);
            res.json({status: false, title: "Error en la pagina", description: "Lo sentimos, parece que ha ocurrido un error en la página web. Por favor, póngase en contacto con un administrador para que podamos solucionar el problema lo antes posible. Gracias por su comprensión."});
        } finally {
            con.end();
        }
    });
}