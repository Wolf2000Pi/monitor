#  Monitor Dashboard
### [Englisch](https://github.com/Wolf2000Pi/monitor/blob/main/README.en.md)
### Monitor ist so ähnlich wie [Monitorr](https://github.com/Monitorr/Monitorr)

![bild3](https://github.com/user-attachments/assets/2509faf2-2b43-4491-81d1-c98f64d181af)

Monitor ist ein Dashboard für Selfhoster

## Installieren
Einen LXC Contaimer unter Proxmox Debian 13
```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/debian.sh)"
apt update && apt upgrade -y
apt install git
```

## 1. Node.js installieren
```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```
## 2. Projekt hochladen
```
cd /opt
git clone https://github.com/dein-repo/service-monitor.git
cd service-monitor
```
## 3. Dependencies installieren
```
npm install
```
## 4. Config anpassen
Muss nicht gleich geändert werden, kann im Browser auch geädert werden:
http://Deine-IP:3000/settings
```
nano config.json
```
## 5. Starten (mit PM2 für Autostart)
```
npm install -g pm2
pm2 start server.js --name monitor
pm2 startup
pm2 save
```

## Der monitor ist erreichbar unter: http://Deine-IP:3000
# Settings-Seite

## Zugriff: http://192.168.178.144:3000/settings

## Features:
- Titel & Logo ändern (sollte welche fehlen dann im Ordner assets/img hinzufügen.(png, jpg, jpeg, gif, ico, svg))
- Refresh Intervall & Timeout
- Services hinzufügen/entfernen
- Benützer Password
## Updaten
```
cd /opt/monitor/
npm run update && pm2 restart monitor
```

Dieses Programm wurde teilweise mit OpenCode geschrieben
