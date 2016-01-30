var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

EmployeeProvider = function(host, port) {
  this.db= new Db('users', new Server(host, port), {safe: false}, {auto_reconnect: true}, {});
  this.db.open(function(){});
};


EmployeeProvider.prototype.getCollection= function(callback) {
  this.db.collection('users', function(error, employee_collection) {
    if( error ) callback(error);
    else callback(null, employee_collection);
  });
};

//find all employees
EmployeeProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};



//find using condition
EmployeeProvider.prototype.findCondition = function(name, city, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback( error )
      else {
        employee_collection.find({name: name, city: city}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};




//find an employee by ID
EmployeeProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee_collection.findOne({_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save new employee
EmployeeProvider.prototype.save = function(users, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        if( typeof(users.length)=="undefined")
          users = [users];

        for( var i =0;i< users.length;i++ ) {
          employee = users[i];
          employee.created_at = new Date();
        }

        employee_collection.insert(users, function() {
          callback(null, users);
        });
      }
    });
};

// update an employee
EmployeeProvider.prototype.update = function(employeeId, users, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error);
      else {
        employee_collection.update(
					{_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
					users,
					function(error, users) {
						if(error) callback(error);
						else callback(null, users)       
					});
      }
    });
};

//delete employee
EmployeeProvider.prototype.delete = function(employeeId, callback) {
	this.getCollection(function(error, employee_collection) {
		if(error) callback(error);
		else {
			employee_collection.remove(
				{_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
				function(error, employee){
					if(error) callback(error);
					else callback(null, employee)
				});
			}
	});
};

exports.EmployeeProvider = EmployeeProvider;
