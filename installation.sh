cd ./WebServer

echo "Current Directory : ${PWD}\n\n"

apt update && upgrade -y
apt install nodejs
apt install npm

npm install
