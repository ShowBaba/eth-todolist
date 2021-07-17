const { assert } = require("chai");

const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", (accounts) => {
  // accounts contains all the accounts in the blockchain

  // get a copy of the smart contract, before each test run get a copy of the deployed contract
  before(async () => {
    this.todolist = await TodoList.deployed();
  });

  // check if it deploys successfully
  it("deploys successfully", async () => {
    const address = await this.todolist.address;
    console.log(address)
    assert.notEqual(address, 0x0);
    assert.notEqual(address, ""); // should not be empty string
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("list tasks", async () => {
    const taskCount = await this.todolist.taskCount();
    const task = await this.todolist.tasks(taskCount);
    assert.equal(task.id.toNumber(), taskCount.toNumber());
    assert.equal(task.content, "This is a task created by SHOW");
    assert.equal(task.completed, false);
    assert.equal(taskCount.toNumber(), 1);
  });

  it('creates tasks', async () => {
    const result = await this.todolist.createTask('A new task');
    const taskCount = await this.todolist.taskCount()
    // check task count is correct
    assert.equal(taskCount, 2)
    // check if TaskCreated even was cerated
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 2);
    assert.equal(event.content, 'A new task');
    assert.equal(event.completed, false)
  })
});
