# Monitor Dashboard
### Monitor is similar to [Monitorr](https://github.com/Monitorr/Monitorr)

![bild3](https://github.com/user-attachments/assets/2509faf2-2b43-4491-81d1-c98f64d181af)

Monitor is a dashboard for self-hosters

## Install
An LXC container on Proxmox Debian 13
```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/debian.sh)"
apt update && apt upgrade -y
apt install git
```

## 1. Install Node.js
```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```
## 2. Upload project
```
cd /opt
git clone https://github.com/your-repo/service-monitor.git
cd service-monitor
```
## 3. Install dependencies
```
npm install
```
## 4. Adjust config
Does not need to be changed immediately, can also be edited in the browser:
http://Your-IP:3000/settings
```
nano config.json
```
## 5. Start (with PM2 for autostart)
```
npm install -g pm2
pm2 start server.js --name monitor
pm2 startup
pm2 save
```

## The monitor is accessible at: http://Your-IP:3000
# Settings page

## Access: http://192.168.178.144:3000/settings

## Features:
- Change title & logo (add to assets/img folder if any are missing (png, jpg, jpeg, gif, ico, svg))
- Refresh interval & timeout
- Add/remove services
- User password
## Update
```
cd /opt/monitor/
npm run update && pm2 restart monitor
```

This program was partially written with OpenCode
