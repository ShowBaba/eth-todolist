pragma solidity ^0.5.16;

contract TodoList {
  // keep track of the number of todo list
  // declear a state variable, they are always written to the blockchain
  // make public to read the var from the contract
  uint public taskCount = 0; // taskCount is written to the blockchain storage

  // LIST TASKS
  // model the task with a struct
  struct Task {
    uint id;
    string content;
    bool completed;
  }

  // put tasks in stotrage on the blockchain
  // create a state variable
  mapping(uint => Task) public tasks;  // has a dataType of mapping

  // create an event to broadcast an action
  event TaskCreated(
    uint id,
    string content,
    bool completed
  );

  // task completed event
  event TaskCompleted(
    uint id,
    bool completed
  );

  // add a constructor to create a new task everytime the contract is caled
  constructor() public {
    // add a default task
    createTask("This is a task created by SHOW");
  }

  // crate task function
  function createTask(string memory _content) public {
    // update task count
    taskCount ++;  

    // put task in the task mapping
    tasks[taskCount] = Task(taskCount, _content, false);

    // broadcast an event that the task was created
    // call the event created above
    emit TaskCreated(taskCount, _content, false);
  }

  // complete task function
  function toggleCompleted(uint _id) public {  // underscore = local variable
    // read the task by id
    Task memory _task = tasks[_id];  // variable is decleared with the Task type in memory;
    // update completed property
    _task.completed = !_task.completed;
    // put it back in the mapping
    tasks[_id] = _task;   

    // trigger TaskCompleted event
    emit TaskCompleted(_id, _task.completed);
  }
}
