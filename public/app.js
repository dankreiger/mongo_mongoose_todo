var url = '/api/todos';

$(document).ready(function(){
  $.getJSON(url)
  .done(addTodos)
  .fail(ajaxFail);

  $("#todoInput").keypress(function (event) {
      if (event.which == 13) createTodo()
  });

  $('.list').on('click', 'li', function(){
    updateTodo($(this));
  });

  $('.list').on('click', 'span', function(event){
    event.stopPropagation(); // stops LI event listener
    removeTodo($(this).parent());
  });
});


function addTodos(todos) {
  // add todos to the page here
  todos.forEach(function(todo){
    addTodo(todo);
  });
}

function createTodo(event) {
  // send request to create new todo
  var usrInput = $('#todoInput').val();
  $.post(url, {name: usrInput })
  .done(addTodo)
  .catch(function(err){ console.log(err); });
}

function addTodo(todo) {
  var newTodo = $(`<li class='task'>${todo.name} <span>X</span></li>`);
  newTodo.data('id', todo._id);
  newTodo.data('completed', todo.completed);

  if(todo.completed) newTodo.addClass('done');
  $('.list').append(newTodo);
  $('#todoInput').val('');
}

function removeTodo(todo) {
  var clickedId = todo.data('id');
  $.ajax({
      url: `${url}/${clickedId}`,
      method: 'DELETE',
    })
    .then(function(data){
      todo.remove();
    })
    .catch(function(err){
      console.log(err);
    })
}

function updateTodo(todo) {

  var isDone = !todo.data('completed');
  var updateData = {completed: isDone};

  $.ajax({
      url: `${url}/${todo.data('id')}`,
      method: 'PUT',
      data: updateData
    })
    .then(function(data){
      todo.toggleClass('done');
      todo.data('completed', isDone);
    })
    .catch(function(err){
      console.log(err);
    })
}

function ajaxFail() {
  alert('Ajax failed');
}
