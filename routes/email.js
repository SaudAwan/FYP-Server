const { sendMail, isValidEmailAddress } = require('../utils/mailer');
const constants = require('../constant');

module.exports=(db)=>{
    const router=require('express').Router()


    router.get('/api/emails',(req, res) => {

        db.emails.findAll({
            where:{sender_id:req.query.user_id
        }})
        .then((emails)=>{
            res.send({emails});
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    });


    router.get('/api/emails/adresses',(req, res) => {

        db.emailAddresses.findAll()
        .then((emailAddresses)=>{
            res.send({emailAddresses});
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    });

    router.delete('/api/emails/:id',(req, res)=>{
        db.emails.destroy({
            where:{id: parseInt(req.params.id)}
        })
        .then(()=>{
            res.send({message:'Task deleted'});
        })
        .catch(()=>{
            res.send({message:'Error occured'});
        });
    });

    router.post('/api/emails/bulkSend',async (req, res)=>{
        console.log(req.body)
        // sent emails here first
        const validEmails = [];
        for(let recipient of (req.body.recipients || [])) {
            if (!isValidEmailAddress(recipient)) {
                continue;
            }
            validEmails.push(recipient);
        }

        const payload = {
            to: validEmails,
            title: req.body.content.title,
            body: req.body.content.body

        }
        await sendMail(constants.EMAIL_TEMPLATE.GENERIC_TEMPLATE, payload);

        // write to db
        db.emails.create({
            content: req.body.content,
            recipients: req.body.recipients
        })
        .then(async()=>{
            db.emailAddresses.bulkCreate(validEmails.map(address => ({address})), {ignoreDuplicates: true})
            res.send({message:'Emails sent successfully'})
        })
        .catch((e)=>{
            console.log(e)
            res.send({message: 'Error occured'})
        })
    });

    return router
}