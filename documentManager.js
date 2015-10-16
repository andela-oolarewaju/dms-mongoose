var mongoose = require('mongoose');
require('./schema');
var User = mongoose.model('User');
var Role = mongoose.model('Role');
var Document = mongoose.model('Document');

module.exports = {
	//create user
  createUser: function(first, last, role) {
  	//find a role
    Role.findOne({
      title: role
    }).then(function(roles) {
    	//create a role if these's none
      if (!roles) {
        Role.create({
          title: role
        }).then(function() {
        	//create a user
          return User.create({
            firstName: first,
            lastName: last,
            roleTitle: role
          });
        });
      } else {
      	//create a user if there's a role
        return User.create({
          firstName: first,
          lastName: last,
          roleTitle: role
        });
      }
    });
    //create user 
    return User.create({
      firstName: first,
      lastName: last,
      roleTitle: role
    });
  },
  //get all users
  getAllUsers: function() {
  	//find all users
    return User.find({}, function(err, users) {
      if (err) {
        return err;
      }
      return users;
    });
  },
  //create a role
  createRole: function(title) {
  	//create a role by the title user provides
    return Role.find({
      title: title
    }, function(roles) {
      if (roles) {
        console.log("error", err);
        return err;
      }
      if (!roles) {
        return Role.create({
          title: title
        });
      }
    });
  },
  //get all roles
  getAllRoles: function() {
    return Role.find();
  },
  //create document
  createDocument: function(title, roleTitle) {
  	//find a role first
    Role.findOne({
      title: roleTitle
    }).then(function(roles) {
    	//create role if there's none
      if (!roles) {
        Role.create({
          title: roleTitle
        }).then(function() {
        	//create a document
          return Document.create({
            title: title,
            roleTitle: roleTitle
          });
        });
      } else {
      	//create a document if role exists
        return Document.create({
          title: title,
          roleTitle: roleTitle
        });
      }
    });
    //create a document
    return Document.create({
      title: title,
      roleTitle: roleTitle
    });
  },
  //get all documents
  getAllDocuments: function(limit) {
    return Document.find().sort({
      publishDate: 'desc'
    }).limit(limit).exec(function(err, docs) {
      if (err) {
        console.log(err);
      }
      return docs;
    });
  },
  //get documents by a role
  getAllDocumentsByRole: function(role, limit) {
  	//find all documents by role passed in
    return Document.find({
      roleTitle: role
    }).sort({
    	//sort by publlish date in descending order and return by limit
      publishDate: 'desc'
    }).limit(limit).exec(function(err, docs) {
      if (err) {
        return err;
      }
    });
  },
  //get all documents by date
  getAllDocumentsByDate: function(date, limit) {
  	//find all documents by created date
    return Document.find({
      createdAt: date
    }).limit(limit).sort({
    	//sort by publish date in descending order and return by limit 
      publishDate: 'desc'
    }).exec(function(err, docs) {
      if (err) {
        return err;
      }
    });
  }
}
