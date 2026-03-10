#  Monitor Dashbord
### Monitor ist so ähnlich wie Monitorr

![bild3](https://github.com/user-attachments/assets/2509faf2-2b43-4491-81d1-c98f64d181af)

Monitor ist ein Dashbord für Selfhoster

## Installieren
Einen LXC Contaimer unter Prxmox Debian 13
```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/debian.sh)"
apt update && apt upgrade -y

## 1. Node.js installieren
```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

## 2. Projekt hochladen
```
cd /opt
sudo git clone https://github.com/dein-repo/service-monitor.git
cd service-monitor

## 3. Dependencies installieren

```
npm install

## 4. Config anpassen

```
nano config.json

# 5. Starten (mit PM2 für Autostart)

```
sudo npm install -g pm2
pm2 start server.js --name monitor
pm2 startup
pm2 save
