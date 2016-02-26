# Pet Project - TodoMVC

Just imagine you've been hired to work on the (hypothetical) Kreios TodoMVC project, a project whose purpose is to create a cheap knock-off of the more popular [Wunderlist](https://www.wunderlist.com/) application.

__Core features:__
* Manage a list of todo items
* Mark items as complete
* Clear (i.e. forget about) completed items
* Filter items by status

The pre-sales team has already built a small prototype of the core application, which you are now supposed to extend into the full-fledged application. That prototype is just a bit of JavaScript, HTML and CSS - no back-end what-so-ever!

## How to get started ##
* Install Node.js version 5.7.0
* Install IntelliJ (optional)
* Use `npm install` to install the projects dependencies
* Use `npm test` to run the projects test suite
* Create a personal fork of the [official "Pet Store" repository](https://bitbucket.kreios.lu/projects/PET/repos/pet-project/browse) on the Kreios Bitbucket server

## Tasks

The following table gives the list of tasks we'd like you to work on, listed in order of priority.

Each task should be implemented on a dedicated feature branch (following the [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) branching model). Once you consider that feature to be completely implemented and ready to be shipped, you should push the feature branch back to the server and then then create a pull request that best summarizes the state of your work.

* **_TODO-1_: Add support for managing more than one list.** This includes the ability for the user to add new/delete existing lists as well as to give each list a meaningful name. Make sure the UI extensions required are consistent with the existing visual style of the application and that there are meaningful unit tests for the new feature, as well.
* **_TODO-2_: Replace the local storage with a proper server-side back-end** implemented on top of [Socket.io](http://socket.io/). All connected clients should share the same lists. Updates requested by one client should immediately be made visible to all other clients without explicit page refresh (e.g. using the CQRS pattern). Make sure the new back-end process can be easily started via ``grunt``.
