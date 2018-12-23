// NOTE: to-do states
// 1. waiting (COMPLETED = FALSE)
// 2. checked off (COMPLETED = TRUE)
// 3. deleted (COMPLETED = FALSE?)
var form = document.getElementById("todo-form");

//get posted to-dos and publish them on the site
//<div class="todo">
//  <i class="far fa-square"></i>Example to-do <input id="delete" type="button" value="-" />
//</div>

var gotten;

document.addEventListener("DOMContentLoaded", function(event) {
  var xhttp = new XMLHttpRequest();
  var todos;

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      todos = JSON.parse(this.responseText);
      console.log("List of todos: ", todos);
      if (todos) {
        todos.sort(function(a,b){return a.created - b.created});
        for (var i = 0; i < todos.length; i++) {
          createTodo(todos[i]);
          if (i%2 == 0) {
            document.getElementById(todos[i].id).classList += " dark";
          }
        }
      }
    }
  };

  xhttp.open("GET", "https://api.kraigh.net/todos", true);
  xhttp.setRequestHeader("x-api-key", KEY);
  xhttp.send();
});

document.getElementById("todos").addEventListener("click", function(e){
  e = e || window.event;
  var clicked = e.target || e.srcElement;
  if (clicked.tagName === "I") {
    if (clicked.className === "far fa-square" || clicked.className === "far fa-check-square") {
      var id = clicked.parentNode.id;
      console.log("checking todo");
      checkTodo(clicked);
    }
    // else if (clicked.className === "far fa-check-square") {
    //   var id = clicked.parentNode.id;
    //   console.log("checking todo");
    //   clicked.className = "far fa-square";
    //   checkTodo(id);
    // }
  }
  else if (clicked.tagName == "INPUT") {
    var id = clicked.parentNode.id;
    if (clicked.type === "button") {
      console.log("deleting todo");
      deleteTodo(clicked);
    }
  }
});

// create the to-do template
function createTodo(data) {
  console.log("creating todo");
  var todos = document.getElementById("todos");
  var newDiv = document.createElement("div");
  newDiv.id = data.id;
  newDiv.className = "todo";
  var newCheckbox = document.createElement("i");
  if (data.completed) {
    newCheckbox.classList = "far fa-check-square";
  }
  else {
    newCheckbox.classList = "far fa-square";
  }
  var newDel = document.createElement("input");
  newDel.type = "button";
  newDel.className = "delete";
  newDel.value = "-";
  var spanText = document.createElement("span");
  spanText.className = "text";
  if (data.completed) {
    spanText.classList += " checked";
  }
  todoText = document.createTextNode(data.text);
  spanText.appendChild(todoText);
  newDiv.appendChild(newCheckbox);
  newDiv.appendChild(spanText);
  newDiv.appendChild(newDel);
  todos.appendChild(newDiv);
}

form.onsubmit = function(e) {
  // post a to-do to the server
  var input = document.getElementById("create").value;
  document.getElementById("create").value = "";
  console.log(input);
  var data = {
    text: input
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(e) {
    //when the request is sent
    if (this.readyState == 4 && this.status == 200) {
      var todo = JSON.parse(this.responseText);
      console.log("To-do parsed");
      console.dir(todo);
      createTodo(todo);
      // sets the color to be different for every other todo
      console.log(document.getElementById("todos").childNodes.length);
      //creates confirmation text
      var confirmation = document.getElementById("confirmation");
      var check = document.createElement("i");
      check.className = "fas fa-check";
      confirmation.appendChild(check);
      confirmation.style.display = "block";
      confirmation.innerHTML += "&nbsp; To-Do has been added!";
      setTimeout(function(){confirmation.style.display = "none"; confirmation.innerHTML = "";}, 5000);
    }
    else if (this.readyState == 4) {
      console.log("Status: ", this.status);
    }
  };

  xhttp.onerror = function (e) {
    console.log(xhttp.statusText);
  };

  xhttp.open("POST", "https://api.kraigh.net/todos", true);
  xhttp.setRequestHeader("content-type", "application/json");
  xhttp.setRequestHeader("x-api-key", KEY);
  xhttp.send(JSON.stringify(data));
  return false;
}

// get a specific todo
function getTodo(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
      gotten = JSON.parse(this.responseText);
      console.log(gotten);
    }
  };
  xhttp.open("GET", "https://api.kraigh.net/todos/" + id, true);
  xhttp.setRequestHeader("x-api-key", KEY);
  xhttp.send();
}

// delete a todo
function deleteTodo(el) {
  console.log("Todo ID: ", el.parentNode.id);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(e) {
    if (this.readyState === 4 && this.status === 200) {
      var todo = JSON.parse(this.responseText);
      console.dir(todo);
      el.parentNode.parentNode.removeChild(document.getElementById(el.parentNode.id));
    }
    else if (this.readyState == 4) {
      console.log(this.responseText);
    }
  };

    xhttp.open("DELETE", "https://api.kraigh.net/todos/" + el.parentNode.id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("x-api-key", KEY);
    xhttp.send();
    console.log("todo deleted");
}

// check off a todo
function checkTodo(el) {
  var data = {
    completed: true
  };
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
      todo = JSON.parse(this.responseText);
      console.dir(todo);
      el.className = "far fa-check-square";
      el.parentNode.childNodes[1].classList += " checked";
    }
    else if (this.readyState) {
      console.log(this.status, this.responseText);
      el.className = "far fa-check-square";
      el.parentNode.childNodes[1].classList += " checked";
    }
  };
  console.log("To-Do id: ", el.parentNode.id);
  xhttp.open("PUT", "https://api.kraigh.net/todos/" + el.parentNode.id, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("x-api-key", KEY);
  xhttp.send(JSON.stringify(data));
}
