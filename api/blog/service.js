const getDb = require('../../utils/db');
var joi = require('joi');

module.exports.addBlog = async function (req, res, next) {
    let db = await getDb();
    const {company_id} = req.user;
    const {body} = req;
    const {error, value} = joi.validate({
      blog_company: body.blog_company,
      name: body.name,
      designation: body.designation,
      contact_number: body.contact_number
    }, {
      blog_company: joi.string().required(),
      name: joi.string().required(),
      designation: joi.string().required(),
      contact_number: joi.string().required()
    });
    if (error !== null) {
      throw error.details;
    }
    body.company_id = company_id;
  
    await db.blogs.insert(body);
    res.send({status: "success"});
  }
  
  module.exports.getBlogs = async function (req, res, next) {
    let db = await getDb();
    var field = ["name", "blog_company"];
    const {company_id} = req.user;
    const queryParams = req.query;
    var {sortBy, asc, limit, offset, searchText} = queryParams;
    var params = {'deleted_at': null, company_id: company_id};
    if (searchText) {
      params.or =  [{
        "name ILIKE": "%" + searchText + "%",
      }, {
        "blog_company ILIKE": "%" + searchText + "%",
      }];
    } else {
      field.forEach(col => {
        var likeColumn = col + " ILIKE";
        if (queryParams && queryParams[col]) params[likeColumn] =  "%" + queryParams[col] + "%";
      })
    }
    var resp = await db.blogs.find(params, {
      // fields: ['id', 'email', 'updated_at', 'is_admin', 'enabled', 'account_verified'],
      // order: [{
      //   field: sortBy || 'id',
      //   direction: asc ? 'asc' : 'desc',
      //   nulls: 'first'
      // }],
      // limit: limit || 10,
      // offset: offset || 0
    });
    console.log(resp)
    res.send(resp);
  }

module.exports.addEventBlog = async function ({body}, res, next) {
    let db = await getDb();
    console.log(body);
  
    let rows = [];
    body.blogs.forEach(element => {
        rows.push({event_id: body.event_id, type: element.type, blog_id: element.id});
    });
    console.log(rows);
  
    await db.event_blogs.insert(rows);
    res.send({status: "SUCCESS"})
  }
  
  module.exports.getEventBlogs = async function (req, res, next) {
    let db = await getDb();
    const {company_id} = req.user;
    var field = ["name", "company", "designation", "type"];
    var {sortBy, asc, limit, offset, event_id} = req.query;
    const data = await db.eventBlogList(company_id, event_id, limit, offset);
    res.send(data);
  }
  
  module.exports.updateEventBlog = async function (req, res, next) {
    let db = await getDb();
    const {id} = req.params;
    var {error, value} = joi.validate({id: id}, {
      id: joi.number().integer().required()
    });
    if (error !== null) {
      throw error.details;
    }
    let eventBlog = await db.blogs.update({id: id}, req.body);
    if (eventBlog.length > 0) {
      res.send({status: 'SUCCESS', 'id': eventBlog[0].id});
    }
    else {
      throw "Event Blog doesn't exist";
    }
  }
  
module.exports.getBlogTypes = async function (req, res, next) {
    let db = await getDb();
    const {company_id} = req.user;
    const data = await db.blog_types.find({company_id: company_id}, {
        fields: ['id', 'name'],
        order: [{
            field: 'id',
            direction: 'asc',
            nulls: 'first'
        }]
    });
    res.send(data)
  }