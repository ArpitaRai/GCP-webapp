#!/bin/bash
echo "================================================================="
echo "Updating packages"
echo "================================================================="
sudo yum update -y

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
sudo yum install nodejs npm unzip -y

echo "================================================================="
echo "Installing application dependencies"
echo "================================================================="
sudo systemctl start mariadb

echo "================================================================="
echo "Creating .env file"
echo "================================================================="
echo "DB_DATABASE=nodeexpressmysql
DB_USER=root
DB_PASSWORD=rootroot
DB_HOST=localhost" > .env


echo "=======================ALL DONE==================================="

