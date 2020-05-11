echo "
----------------------
  START SERVER & CONFIG NGINX
----------------------
"

sudo npm run build

sudo pm2 start ./src/server/bin/www

# modify the nginix config file

sudo rm /etc/nginx/sites-available/default

sudo nano /etc/nginx/sites-available/default

# restart the nginix service 
sudo systemctl restart nginx