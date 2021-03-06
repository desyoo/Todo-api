var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 4000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

/*
{
	id: 1,
	description: 'Meet friend for lunch',
	completed: false
}
*/

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	// if has property && completed === 'true'
	//   filteredTodos = _.where
	// else 

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});


app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		//can't completed b/c of bad data
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId++;;
	todos.push(body);

	console.log('description: ' + body.description);

	res.json(body);
});


app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}


});


// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	} 

	if (body.hasOwnProperty('description') && _.isString(body.description) 
		&& body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});

app.listen(PORT, function() {
	console.log('express listening on port ' + PORT + '!');
});



