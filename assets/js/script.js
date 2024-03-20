// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let tasks = [];

// Todo: create a function to generate a unique task id
function generateTaskId() {
    // const taskId = $(this).attr('')
}

// Todo: create a function to create a task card
function createTaskCard(task) {
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

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
        todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
        inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
        doneList.append(createTaskCard(task));
        }
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        
        helper: function (e) {
        
        const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
        
        return original.clone().css({
            width: original.outerWidth(),
        });
        },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskTitleInput = $('#taskTitle');
    const taskDueDateInput = $('#taskDueDate');
    const taskDescriptionInput = $('#taskDescription');

    const newTask = {
        title: taskTitleInput.val().trim(),
        date: taskDueDateInput.val(),
        description: taskDescriptionInput.val().trim(),
        status: 'to-do'
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    $('#formModal').modal('hide');
    console.log(tasks);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
  const tasks = taskList;

  // ? Remove project from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the project.
  tasks.forEach((task) => {
    if (task.id === taskId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  // ? We will use our helper function to save the projects to localStorage
  saveProjectsToStorage(tasks);

  // ? Here we use our other function to print projects back to the screen
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {   
    renderTaskList();

    $('#formModal').on('submit', handleAddTask);
    $('#formModal').on('submit', createTaskCard);

    $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
    });

    $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

});

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
};