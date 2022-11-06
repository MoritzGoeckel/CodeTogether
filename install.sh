apt-get install curl
curl -fsSL https://get.docker.com -o get-docker.sh
DRY_RUN=1 sudo sh ./get-docker.sh
docker run hello-world

apt-get install git
