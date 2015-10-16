var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dms-mongoose');
require('./schema');
var User = mongoose.model('User');
var Role = mongoose.model('Role');
var Document = mongoose.model('Document');
var docManager = require('./documentManager');

describe("documentManager", function() {

  describe("User", function() {
    beforeEach(function(done) {
      docManager.createUser('kitan', 'lawson', 'friend').then(function() {
        done();
      });
    });

    afterEach(function(done) {
      User.remove({}, function() {
        Role.remove({}, function() {
          done();
        });
      });
    });

    it("should validate that a new user created is unique", function(done) {
      //find a user with these datails and check that couut is one
      User.find({
        firstName: 'kitan',
        lastName: 'lawson',
        roleTitle: 'friend'
      }).distinct('firstName').count().exec(function(err, count) {
        expect(count).toEqual(1);
        done();
      })
    });

    it("should have a role defined", function(done) {
      User.find({
        firstName: 'kitan'
      }).then(function(user) {
        expect(user[0].roleTitle).toBeDefined();
        done();
      });
    });

    it("should have both first and last name", function(done) {
      User.find({
        firstName: 'kitan'
      }).then(function(user) {
        expect(user[0].firstName).toBe('kitan');
        expect(user[0].lastName).toBe('lawson');
        done();
      });
    });

    it("should get all users when getAllUsers is called", function(done) {
      //create one more user and check that there are two users
      docManager.createUser('buchi', 'ejehu', 'accountant').then(function() {
        docManager.getAllUsers().then(function(users) {
          expect(users.length).toBe(2);
          done();
        });
      });
    });
  })

  describe("Role", function() {
    beforeEach(function(done) {
      docManager.createRole('friend').then(function() {
        done();
      });
    });

    afterEach(function(done) {
      Role.remove({}, function() {
        done();
      });
      done();
    });

    it("should validate that a new role has a unique title", function(done) {
      //check that the role 'friend' is just one
      Role.find({
        title: 'friend'
      }).distinct('title').count().exec(function(err, count) {
        expect(count).toEqual(1);
        done();
      });
    });

    it("should get all roles when getAllRoles is called", function(done) {
      //creat a role and then check that there are two roles
      docManager.createRole('accountant').then(function() {
        docManager.getAllRoles().then(function(roles) {
          expect(roles.length).toBe(2);
          done();
        });
      });
    });
  });

  describe("Document", function() {
    beforeEach(function(done) {
      docManager.createDocument('students', 'principal').then(function() {
        done();
      });
    });

    afterEach(function(done) {
      Document.remove({}, function() {
        Role.remove({}, function() {
          done();
        });
      });
    });

    it("should validate that a new document has a published date defined", function(done) {
      Document.find({
        title: 'students'
      }).then(function(document) {
        expect(document[0].createdAt).toBeDefined();
        done();
      });
    });

    it("should get all documents by specific number when getAllDocuments is called", function(done) {
      //create another document then get all documents with a limit of 1
      docManager.createDocument('gamers', 'ho').then(function() {
        docManager.getAllDocuments(1).then(function(documents) {
          expect(documents.length).toBe(1);
          done();
        });
      });
    });

    it("should get all documents and order by date when getAllDocuments is called", function(done) {
      //create two more documents and get two back and order by publish date 
      docManager.createDocument('programmers', 'trainers').then(function() {
        docManager.createDocument('patients', 'nurse').then(function() {
          docManager.getAllDocuments(2).then(function(documents) {
            expect(documents.length).toBe(2);
            expect(documents[0].publishDate).toBeGreaterThan(documents[1].publishDate)
            expect(documents[0].title).toBe('patients');
            expect(documents[1].title).toBe('programmers');
            done();
          });
        });
      });
    });
  });

  describe("Search", function() {
    beforeEach(function(done) {
      docManager.createDocument('students', 'principal').then(function() {
        done();
      });
    });

    afterEach(function(done) {
      Document.remove({}, function() {
        Role.remove({}, function() {
          done();
        });
      });
    });

    it("should get all documents by role, order by date and return by limit when getAllDocumentByRole", function(done) {
      //create documents
      docManager.createDocument('pilots', 'principal').then(function() {
        docManager.createDocument('teachers', 'staff').then(function() {
          docManager.createDocument('footballers', 'principal').then(function() {
            //get 2 documents with principal as role in order of published date
            docManager.getAllDocumentsByRole('principal', 2).then(function(documents) {
              expect(documents.length).toBe(2);
              expect(documents[0].publishDate).toBeGreaterThan(documents[1].publishDate)
              expect(documents[2].publishDate).toBeLessThan(documents[1].publishDate)
              expect(documents[0].title).toBe('footballers');
              expect(documents[1].title).toBe('pilots');
              done();
            });
          });
        });
      });
    });

    it("should get all documents on a specific date when getAllDocumentsByDate", function(done) {
    	//store current date in a variable
      var currentDate = new Date()
      var currentDate = currentDate.getDay() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear();
      //create documents
      docManager.createDocument('seniors', 'developers').then(function() {
        docManager.createDocument('juniors', 'accountant').then(function() {
          docManager.createDocument('dancers', 'prisoner').then(function() {
          	//get 2 documents created on current date and in descending order
            docManager.getAllDocumentsByDate(currentDate, 2).then(function(documents) {
              expect(documents.length).toBe(2);
              expect(documents[0].title).toBe('dancers');
              expect(documents[1].title).toBe('juniors');
              done();
            });
          });
        });
      });
    });
  });
});
