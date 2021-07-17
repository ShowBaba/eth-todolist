pragma solidity ^0.5.16;

contract TodoList {
  // keep track of the number of todo list
  // declear a state variable, they are always written to the blockchain
  // make public to read the var from the contract
  uint public taskCount = 0;
}