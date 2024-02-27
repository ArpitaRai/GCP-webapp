#!/bin/bash
echo "================================================================="
echo "Updating packages"
echo "================================================================="

sudo yum update -y || { echo "Failed to update packages. Exiting."; exit 1; }

echo "================================================================="
echo "Install Node and unzip"
echo "================================================================="

curl --silent --location https://rpm.nodesource.com/setup_18.x | sudo bash - || { echo "Failed to setup Node.js repository. Exiting."; exit 1; }
sudo yum install nodejs -y || { echo "Failed to install Node.js. Exiting."; exit 1; }
sudo yum install unzip -y || { echo "Failed to install unzip. Exiting."; exit 1; }


# echo "================================================================="
# echo "Installing and Setting up mysql"
# echo "================================================================="

# sudo yum install mariadb-server -y || { echo "Failed to install MariaDB server. Exiting."; exit 1; }
# sudo systemctl start mariadb || { echo "Failed to start MariaDB. Exiting."; exit 1; }
# sudo mysql -uroot -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'rootroot';FLUSH PRIVILEGES;CREATE DATABASE nodeexpressmysql;" || { echo "Failed to configure MariaDB. Exiting."; exit 1; }

# echo "================================================================="
# echo "Run mariadb"
# echo "================================================================="

# sudo systemctl start mariadb || { echo "Failed to start MariaDB. Exiting."; exit 1; }
# sudo systemctl enable mariadb || { echo "Failed to enable MariaDB. Exiting."; exit 1; }
# sudo systemctl status mariadb

echo "================================================================="
echo "Create directory : /opt/csye6225dir"
echo "================================================================="

sudo mkdir -p /opt/csye6225dir || { echo "Failed to create /opt/csye6225dir. Exiting."; exit 1; }

echo "================================================================="
echo "Move webapp zip to the directory : /opt/csye6225dir and unzip it"
echo "================================================================="

sudo mv /tmp/webapp.zip /opt/csye6225dir/webapp.zip || { echo "Failed to move zip to /opt/csye6225dir/. Exiting."; exit 1; }
cd /opt/csye6225dir || { echo "Failed to cd into /opt/csye6225dir . Exiting."; exit 1; }
sudo unzip webapp.zip || { echo "Failed to unzip webapp.zip . Exiting."; exit 1; }

echo "================================================================="
echo "Installing application dependencies and setting it up"
echo "================================================================="
sudo npm install || { echo "Failed to install npm . Exiting."; exit 1; }


# echo "================================================================="
# echo "Creating .env file"
# echo "================================================================="

# echo "MYSQL_DATABASE=nodeexpressmysql
# MYSQL_USER=root
# MYSQL_PASSWORD=rootroot
# MYSQL_HOST=localhost" | sudo tee .env

echo "================================================================="
echo "Move webapp service file"
echo "================================================================="

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service || { echo "Failed to move webapp.service . Exiting."; exit 1; }

# echo "================================================================="
# echo "Creating user and changing directory ownership"
# echo "================================================================="
# sudo adduser csye6225 --shell /usr/sbin/nologin || { echo "Failed to add csye6225 user. Exiting."; exit 1; }
# sudo chown -R csye6225:csye6225 /opt/csye6225dir || { echo "Failed to change directory permissions. Exiting."; exit 1; }
# sudo chmod -R 744 /opt/csye6225dir || { echo "Failed to change directory permissions. Exiting."; exit 1; }

echo "================================================================="
echo "Run the application"
echo "================================================================="

sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service

echo "=======================ALL DONE==================================="





