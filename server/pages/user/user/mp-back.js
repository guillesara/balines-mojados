const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

const mysql = require('mysql2');
const { Preference } = require('mercadopago');

module.exports = (router, database, mp) => 
{
    router.get('/mp/back', async (req, res) => {
        res.render('user/mp-back', {});
    });

    router.post('/mp/status', async (req, res) => {
        const query = req.body;
        if (!query.payment_id) res.json({status: "error", title: "Error", descripcion: "El id de pago no se encontro."});

        const con = mysql.createConnection(database);
        
        const [results_reserves] = await con.promise().query(`SELECT payment_id FROM reserves WHERE payment_id = ${query.payment_id}`, {}).catch(console.log);
        if (results_reserves[0]) return res.json({status: "error", title: "Error", descripcion: "Este pago ya se realizo."});



        res.render('user/mp-back', {});
    });
}