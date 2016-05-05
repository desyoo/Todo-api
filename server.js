var express = require('express');
var bodyParser = require('body-parser');

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

// GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo;

	todos.forEach(function(task) {
		if (todoId === task.id) {
			matchedTodo = task;
		}
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

});


app.post('/todos', function (req, res) {
	var body = req.body;

	body.id = todoNextId++;;
	todos.push(body);

	console.log('description: ' + body.description);

	res.json(body);
});


app.listen(PORT, function() {
	console.log('express listening on port ' + PORT + '!');
});



