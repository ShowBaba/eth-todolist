var TodoList = artifacts.require("./TodoList.sol");
var TaskList = artifacts.require("./TaskList.sol");
module.exports = function (deployer) {
  deployer.deploy(TodoList);
  deployer.deploy(TaskList);
};
