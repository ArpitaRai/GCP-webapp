#!/bin/bash
echo "================================================================="
echo "Updating packages"
echo "================================================================="
sudo yum update -y

echo "================================================================="
echo "Creating user group and user"
echo "================================================================="
sudo groupadd csye6225group
sudo useradd -s /bin/false -g csye6225group -d /opt/csye6225dir -m csye6225user

echo "================================================================="
echo "Installing and Setting up mysql"
echo "================================================================="
sudo yum install mariadb-server -y
sudo systemctl start mariadb
sudo mysql -uroot -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'rootroot';FLUSH PRIVILEGES;CREATE DATABASE nodeexpressmysql;"

echo "================================================================="
echo "Install Node npm and zip"
echo "================================================================="
curl --silent --location https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y


# Install unzip
sudo yum install unzip -y

echo "================================================================="
echo "Installing application dependencies"
echo "================================================================="
sudo systemctl start mariadb

echo "================================================================="
echo "Creating .env file"
echo "================================================================="
echo "MYSQL_DATABASE=nodeexpressmysql
MYSQL_HOST=root
MYSQL_PASSWORD=rootroot
MYSQL_HOST=localhost" > .env

echo "================================================================="
echo "Installing application dependencies and setting it up"
echo "================================================================="
sudo chown -R csye6225user:csye6225group /opt/csye6225dir
sudo mv /tmp/webapp.zip /opt/csye6225dir/webapp.zip
cd /opt/csye6225dir && sudo unzip webapp.zip
cd webapp && sudo npm install
echo "MYSQL_DATABASE=nodeexpressmysql
MYSQL_HOST=root
MYSQL_PASSWORD=rootroot
MYSQL_HOST=localhost" > .env
sudo chown -R csye6225user:csye6225group /opt/csye6225dir/webapp-main




echo "=======================ALL DONE==================================="

