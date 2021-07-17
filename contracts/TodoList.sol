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
  // creaate a state variable
  mapping(uint => Task) public tasks;  // has a dataType of mapping

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
  }
}