const SlackW = require('../utils/slack');

module.exports=(db)=>{
    const router=require('express').Router()


    router.get('/api/rewards',(req, res) => {

        db.rewards.findAll()
        .then((rewards)=>{
            res.send({rewards});
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    });

    router.get('/api/users/:userId/rewards/history', (req, res) => {
        const pointsToClaim = process.env.REWARD_POINTS || 300;

        req.points = 0;
        return db.users.findOne({
            where: {
                id: req.params.userId
            }
        }).then(user => {
            if (!user) {
                res.send({message:'User not found.'});
            }

            req.points = user.points;
            
            return db.rewardsHistory.findAll({
                where: {
                    user_id: req.params.userId
                },
                include: [{
                    attributes: ["title"],
                    model: db.rewards,
                    as: 'reward'
                }]
            })
        }).then((rewardsHistory) => {
            return res.send({data: {rewardsHistory, points: req.points, pointsToClaim: parseInt(pointsToClaim)}})
        }).catch((error)=>{
            console.log(error)
            res.send({message:'Error occured'});
        })
    });

    router.post('/api/users/:userId/rewards/:rewardId/claim', (req, res) => {
        const pointsToClaim = parseInt((process.env.REWARD_POINTS || 300).toString());

        db.users.findOne({where: {id: req.params.userId}}).then(user => {
            req.user = user;
            if (!user) {
                return res.send({message: "User not found."});
            }
            
            if (user.points < pointsToClaim) {
                return res.send({message: "Sorry! you don't have enough points to claim this reward."})
            }

            return db.rewards.findOne({
                where: {
                    id: req.params.rewardId
                }
            });
        }).then(reward => {
            if (!reward) {
                return res.send({message: "Reward not found."});
            }

            req.reward = reward;
            return db.rewardsHistory.create({
                reward_id: req.params.rewardId,
                user_id: req.user.id
            }).then(()=> {
                req.user.points -= pointsToClaim;
                return req.user.save();
            })
        }).then(() => {
            const message = `${req.user ? (req.user.name + '<' + req.user.email + '>') : 'User'} has just claimed the reward(${req.reward.title}).`;
            SlackW.postMessageWithWebhook('evenzy', null, message, process.env.slackWebHook);
            return res.send({
                message: 'Reward has been claimed successfully.'
            });
        }).catch(err => {
            console.log(err)
            return res.send({
                message: "Error occured."
            })
        })


    })

    return router
}