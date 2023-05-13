Installing Nginx

Install Nginx on your server. To do this, use the package management of your operating system, for example for Ubuntu:

        sudo apt update
        sudo apt install nginx

Nginx configuration

After installing Nginx, you need to create a configuration file for your site. This is usually done in the /etc/nginx/sites-available/ directory. Create a file there, for example my_website, and paste the following content into it:

        server {
             listen 80;
             server_name your_domain.com www.your_domain.com;
             location / {
                 root /path/to/your/website;
                 try_files $uri $uri/ =404;
             }
        }
Replace your_domain.com with your website domain and /path/to/your/website with the path to the directory where your website files are stored.

Activate your site

Create a symbolic link to your configuration file in the /etc/nginx/sites-enabled/ directory:

        sudo ln -s /etc/nginx/sites-available/my_website /etc/nginx/sites-enabled/

Check your Nginx configuration

        sudo nginx -t

This command should return a successful configuration check message.

      Restart Nginx

      sudo systemctl restart nginx
      
Copy the files to your directory. default is /var/www/mysite/

# Don't forget to change:

YOUR URL

Contract address
