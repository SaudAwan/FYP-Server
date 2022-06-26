const bcrypt = require('bcrypt')
const joi = require('joi')
var jwt = require('../../utils/jwt')

const saltRounds = 8
const defaultPassword = 'password'

export async function addUser(req, res, next) {
  let db = await getDb();
  const {body} = req;
  const {error, value} = joi.validate({
    email: body.email,
    password: body.password
  }, {
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
  });
  if (error !== null) {
    throw error.details;
  }
  var password_hash = await bcrypt.hash(defaultPassword, saltRounds);
  await db.users.insert({
    company_id: body.company_id,
    email: body.email,
    name: body.name,
    user_role: body.user_role,
    phone_number: body.phone_number,
    password: password_hash
  })
  res.send("success")
}

export async function addAdminUser(companyId, email, password) {
  let db = await getDb();

  const {error, value} = joi.validate({
    company_id: companyId,
    email: email,
    password: password
  }, {
    company_id: joi.number().integer().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
  });
  if (error !== null) {
    throw error.details;
  }

  password_hash = await bcrypt.hash(password, saltRounds);
  return await db.users.insert({
    company_id: companyId,
    email: email,
    password: password_hash,
    is_admin: true
  });
}

export async function login(email, password) {
  const {error, value} = joi.validate({
    email: email,
    password: password
  }, {
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
  })
  if (error !== null) {
    throw error.details
  }
  
}

export async function getUsers(req, res, next) {
  
}

export async function getUsersCount(req, res, next) {
  let db = await getDb();
  var field = ["name", "email", "role", "phone_number"];
  const queryParams = req.query;
  var {sortBy, asc, limit, offset} = queryParams;

  var params = {'deleted_at': null};
  field.forEach(col => {
    var likeColumn = col + " like";
    if (queryParams && queryParams[col]) params[likeColumn] =  "%" + queryParams[col] + "%";
  })

  var count = await db.users.count(params);
  res.send({count})
}

export async function getUser(req, res, next) {
  let db = await getDb();
  const {company_id, id} = req.user;
  const {error, value} = joi.validate({id: id}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  let user = await db.users.findOne({
    id: id, 
    company_id: company_id
  }, {
    fields: ['id', 'email', 'name', 'role', 'profile_pic',
    'updated_at', 'is_admin', 'enabled', 'account_verified']
  });
  if (user) {
    res.send(user);
  }
  else {
    res.error({err: "User doesn't exist"});
  }
}

export async function updateUser(req, res, next) {
  let db = await getDb();
  const {userId} = req.params;
  const {body} = req;
  // var {error, value} = joi.validate({id: userId}, {
  //   id: joi.number().integer().required()
  // });
  // if (error !== null) {
  //   throw error.details;
  // }

  // var {error, value} = joi.validate(values, {
  //   is_admin: joi.boolean(),
  //   enabled: joi.boolean(),
  //   account_verified: joi.boolean()
  // });
  // if (error !== null) {
  //   throw error.details;
  // }

  let user = await db.users.update({id: userId}, body);
  if (user.length > 0) {
    res.send({"id": user[0].id});
  }
  else {
    res.error({err: "User doesn't exist"});
  }
}

export async function userProfile(req, res, next) {
  let user = await db.users.findOne({
    id: id, 
    company_id: company_id
  }, {
    fields: ['id', 'email', 'name', 'role', 'profile_pic',
    'updated_at', 'is_admin', 'enabled', 'account_verified']
  });
  if (user) {
    res.send(user);
  }
  else {
    res.error({err: "User doesn't exist"});
  }   
}