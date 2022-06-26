const getDb = require('../../utils/db');
const joi = require('joi');

const getTeamRoles = async function(db) {
  const roles = await db.team_roles.find();
  const _map = {};
  roles.forEach(el =>{
    _map[el.name] = el.id;
  })
  return _map;
}

module.exports.addTeam = async function (query, body) {
  try {
    let db = await getDb()
    const company_id=parseInt(query.company_id)
    const user_id=parseInt(query.user_id)
    const {
      name,
      production,
      operations,
      sponsorship_sales,
      delegate_sales,
      marketing
    } = body

    const roles = await db.team_roles.find({
    },{
      fields: ['id','name']
    })
    await db.teams.insert({
      company_id,
      name,
      created_by: user_id
    })
    .then((res)=>{
      const {id}=res
      promises.push(
        production.map(user => db.team_users.insert({
          team_id: id,
          user_id: user,
          team_role_id: roles[0].id
        })
        .then((res)=>{
          console.log(res)
        })
        .catch((err)=>{
          console.log(err)
        })),
        operations.map(user => db.team_users.insert({
          team_id: id,
          user_id: user,
          team_role_id: roles[1].id
        })),
        sponsorship_sales.map(user => db.team_users.insert({
          team_id: id,
          user_id: user,
          team_role_id: roles[2].id
        })),
        delegate_sales.map(user => db.team_users.insert({
          team_id: id,
          user_id: user,
          team_role_id: roles[3].id
        })),
        marketing.map(user => db.team_users.insert({
          team_id: id,
          user_id: user,
          team_role_id: roles[4].id
        })))
    })
    .catch((err)=>{
      console.log(err)
      throw err
    })
  } catch(err) {
    throw err
  }
}

module.exports.getEmployeeTeams=async function (employeeId){
  try{
    let db = await getDb();
    const employeeTeams =await db.team_users.find({
      user_id:employeeId
    },{
      fields:['id','team_id']
    })
    return employeeTeams
  } catch(err){
    console.log(err)
  }
}

module.exports.getTeamUsers = async function (team_id) {
  try{
    let db = await getDb()
    const users=await db.team_users.join({
      users:{
        type: 'INNER',
        on: {id: 'user_id'}
      }
    })
    .find({
      team_id,
    })
    return{users}
  }
  catch(err){
    throw err
  }
}

module.exports.getTeams = async function (company_id,queryParams) {
  try {
    const {searchText}=queryParams
    var teams
    const companyId=parseInt(company_id)
    let db = await getDb();
    if(!searchText){
      teams=await db.teams.join({
        users:{
          type:'INNER',
          on: {id:'created_by'}
        }
      })
      .find({
        company_id:companyId
      })
    }
    else{
      teams = await db.teams.find({
        or:[{
          'name like': `%${searchText}%`
        }]
      })
      
    }
    return {teams}
  } catch(err) {
    console.log(err);
    throw {code: "500", msg: "Dev error"}
  }
}

module.exports.getTeam = async function (companyId, teamId) {
  let db = await getDb();

  const {error, value} = joi.validate({id: teamId}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  let team = await db.teams.findOne({
    id: teamId, 
    company_id: companyId
  }, {
    fields: ['id', 'email', 'name', 'role', 'profile_pic',
    'updated_at', 'is_admin', 'enabled', 'account_verified']
  });
  if (team) {
    return team;
  }
  else {
    throw "Team doesn't exist";
  }
}

module.exports.updateTeam = async function (teamId, values) {
  let db = await getDb();

  var {error, value} = joi.validate({id: teamId}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  // var {error, value} = joi.validate(values, {
  //   is_admin: joi.boolean(),
  //   enabled: joi.boolean(),
  //   account_verified: joi.boolean()
  // });
  // if (error !== null) {
  //   throw error.details;
  // }

  let team = await db.teams.update({id: teamId}, values);
  if (team.length > 0) {
    return {"id": team[0].id};
  }
  else {
    throw "Team doesn't exist";
  }
}
