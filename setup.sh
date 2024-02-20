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
sudo chmod -R 750 /opt/csye6225dir

echo "================================================================="
echo "Installing and Setting up mysql"
echo "================================================================="
sudo yum install mariadb-server -y
sudo systemctl start mariadb
sudo mysql -uroot -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'rootroot';FLUSH PRIVILEGES;CREATE DATABASE nodeexpressmysql;"

echo "================================================================="
echo "Install Node npm and unzip"
echo "================================================================="

curl --silent --location https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y
sudo yum install unzip -y

echo "================================================================="
echo "Installing application dependencies"
echo "================================================================="

sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo systemctl status mariadb

echo "================================================================="
echo "Creating .env file"
echo "================================================================="

echo "MYSQL_DATABASE=nodeexpressmysql
MYSQL_USER=root
MYSQL_PASSWORD=rootroot
MYSQL_HOST=localhost" > .env

echo "================================================================="
echo "Installing application dependencies and setting it up"
echo "================================================================="

sudo chown -R csye6225user:csye6225group /opt/csye6225dir
sudo chmod -R 700 /opt/csye6225dir
sudo mv /tmp/webapp.zip /opt/csye6225dir/webapp.zip
cd /opt/csye6225dir && sudo unzip webapp.zip
sudo npm install

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service

sudo chown -R csye6225user:csye6225group /opt/csye6225dir

echo "=======================ALL DONE==================================="



