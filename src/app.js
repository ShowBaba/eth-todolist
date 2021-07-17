App = {
  contracts: {},

  load: async () => {
    // load web3 to connect to the blockchain
    await App.loadWeb3();
    // load account
    await App.loadAccount();
    // load contract
    await App.loadContract();
    // load another contract
    // await App.loadNewContract();
    // render account address
    await App.render();
    // render the task data
    await App.renderTasks();

    // update loading state
    App.setLoading(false);
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  // connect to blockchain
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      // select an account manually from the blockchain
      web3.eth.defaultAccount = ethereum._state.accounts[0]
      // console.log(ethereum._state.accounts[0])
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  // connect to the blockchain account
  loadAccount: async () => {
    // the function loadWeb£ above loads the web3 class used below
    App.account = web3.eth.accounts[0]; // load the first account from metamask;
    // check if account loads
    // console.log(App.account)
  },

  loadNewContract: async () => {
    const taskList = await $.getJSON("TaskList.json");
    App.contracts.TaskList = TruffleContract(taskList);
    App.contracts.TaskList.setProvider(App.web3Provider);
    // console.log(App.contracts.TaskList)
    // console.log(JSON.stringify(App.contracts.TaskList.contractName))
    App.taskList = await App.contracts.TaskList.deployed();
  },

  // load smart contract to load the todo-list from it
  loadContract: async () => {
    // Create a JS version of the smart contract
    const todoList = await $.getJSON("TodoList.json"); // calls the TodoList.json file from build/contract
    /**TruffleContract
     * creates a wrapper around the JSON file and allows us interact with it
     */
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);
    // console.log(JSON.stringify(App.contracts));
    // console.log(todoList);
    // get a deployed copy of the smart contract
    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed();
    // console.log(App.todoList)
  },

  // render the account to the client
  render: async () => {
    // Prevent double render
    if (App.loading) {
      return;
    }

    // Update app loading state
    App.setLoading(true);

    // render
    $("#account").html(App.account);

    // Update loading state
    App.setLoading(false);
  },

  createTask: async () => {
    App.setLoading(true);

    const content = $("#newTask").val();
    // update the blockchain
    console.log(App.todoList);
    const response = await App.todoList.createTask(content);
    window.location.reload();
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted);
      // .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      // Show the task
      $newTaskTemplate.show();
    }
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

// load App whenever the page loads

$(() => {
  $(window).load(() => {
    App.load();
  });
});
