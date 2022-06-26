const getDb = require('../../utils/db')
import {addAdminUser, login} from '../user/service';

export async function signUp(req, res, next) {
    const db = getDb();
    const {companyName, email, password} = req.body;
    let company = await db.companies.insert({
        name: companyName,
        created_by: email
    });
    let user = await addAdminUser(company.id, email, password);
    res.send({status: "sucess", user: user});
}

export async function userLogin(req, res, next) {
    var {email, password} = req.body;
    var token = await login(email, password);
    if (token) {
        res.json({token})
    } else {
        res.status(401).send({status: 'Invalid User'})
    }
}