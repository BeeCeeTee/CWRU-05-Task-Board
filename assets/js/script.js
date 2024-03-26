// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let tasks = [];

// Create a function to generate a unique task id
function generateTaskId() {
    nextId++;
    return nextId;
}

// Create a function to create a task card
function createTaskCard(task) {
  console.log(task);
  // Create task card elements
    const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(task.date);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // Compare current date with due date and set appropriate styles
  if (task.date && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.date, 'DD/MM/YYYY');

    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // Append the elements to the card body, and the body to the card itself
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Create a function to render the task list and make cards draggable
function renderTaskList() {
  // Empty each task lane
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    // Append cards to the appropriate lane
    for (let task of tasks) {
        if (task.status === 'to-do') {
        todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
        inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
        doneList.append(createTaskCard(task));
        }
    }
    // Make cards draggable
    $('.draggable').draggable({
        
        helper: function (event) {
        
        const original = $(event.target).hasClass('ui-draggable')
            ? $(event.target)
            : $(event.target).closest('.ui-draggable');
        
        return original.clone().css({
          width: original.outerWidth()
        });
        },
    });
}

// Create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // Create variables to select each input field
    const taskTitleInput = $('#taskTitle');
    const taskDueDateInput = $('#taskDueDate');
    const taskDescriptionInput = $('#taskDescription');

    // Collect user input, assign "to-do" status, and assign a unique id
    const newTask = {
        title: taskTitleInput.val().trim(),
        date: taskDueDateInput.val(),
        description: taskDescriptionInput.val().trim(),
        status: 'to-do',
        id: generateTaskId()
    };

    /* Push the input data to the tasks array, save it to local storage, then render the task list.
      Also hide the modal when the button is clicked*/
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTaskList();
    $('#formModal').modal('hide');
}

// Create a function to handle deleting a task
function handleDeleteTask(event){
  tasks.splice(event.target.dataset.taskId-1,1);
  nextId--
  for (let index = 0; index < tasks.length; index++) {
    tasks[index].id=index+1
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  const taskId = ui.draggable[0].dataset.taskId;

  const newStatus = event.target.id;
console.log(taskId);
  for (let task of tasks) {
    if (task.id == taskId) {
      task.status = newStatus;
    }
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {   
    // Render the task list
    renderTaskList();

    // Add event listeners
    $('#formModal').on('submit', handleAddTask);

    // Make lanes droppable
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop
    });

    // Make the due date field a datepicker
    $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
    });

});

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
};