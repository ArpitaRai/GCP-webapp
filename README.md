# webapp
This application has api's to create, get and update users
## Requirements

For development, you will need Node.js and a node global package, and mySql installed in your environment
test

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      sudo apt install nodejs
      sudo apt install npm

- #### Other Operating Systems

  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version

    $ npm --version

### Database Setup

1. Create a MySQL database for your application.

2. Update the database configuration in `config/db-config.js` with your MySQL credentials.

### Environment Variables

Create a `.env` file in the root of your project with the following content:

```plaintext
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=your_database_name

Make sure to replace your_password and your_database_name with your MySQL password and database name.

You can try to connect to the mySql database server from any client application.

## Quick Start

Install dependencies:

    npm install

Start the server:

    npm start 

