sudo apt install nmap -y
npm install
sudo cp ./ip-scanner.service /etc/systemd/system/ip-scanner.service
sudo systemctl daemon-reload
sudo systemctl enable ip-scanner
sudo systemctl restart ip-scanner
