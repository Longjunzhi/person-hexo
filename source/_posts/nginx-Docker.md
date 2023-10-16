---
title: nginx Docker
date: 2023-09-13 19:08:32
tags:
---

docker nginx 挂载nginx配置文件，日志文件，ssl证书，静态网站。

1.第一步 
```angular2html
sudo mkdir -p /www/nginx/conf \
&& mkdir -p /www/nginx/html \
&& mkdir -p /www/nginx/log 
```

2.第二步
```angular2html
# 生成容器
sudo docker run --name nginx -p 9001:80 -d nginx
# 将容器nginx.conf文件复制到宿主机
sudo docker cp nginx:/etc/nginx /www/nginx/conf
# 将容器中的html文件夹复制到宿主机
sudo docker cp nginx:/usr/share/nginx/html /www/nginx/html
```

3.第三步
```angular2html
sudo docker run \
-p 80:80 \
-p 443:443 \
--name nginx \
-v /www/nginx/conf:/etc/nginx \
-v /www/nginx/log:/var/log/nginx \
-v /www/nginx/html:/usr/share/nginx/html \
-d nginx:latest
```

4.第四步
    vi /www/nginx/config/conf/blog.pangxuejun.cn.conf
```
前端
server {
    listen 80;
    server_name blog.pangxuejun.cn;
    root /user/share/nginx/html/blog.pangxuejun.cn;
    location / {
        try_files $uri $uri/ /index.html;
    }
    rewrite  ^(.*)$  https://blog.pangxuejun.cn$1 permanent;
}
server {
    listen       443  ssl;
    server_name blog.pangxuejun.cn;
    root /usr/share/nginx/html/blog.pangxuejun.cn;

    # gzip config
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 9;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    ssl_certificate      /etc/nginx/cert/blog.pangxuejun.cn.pem;
    ssl_certificate_key  /etc/nginx/cert/blog.pangxuejun.cn.key;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
后端php配置
server {
    listen 80;
    server_name blog-api.qzyyds.com;
    rewrite  ^(.*)$  https://blog-api.pangxuejun.cn$1 permanent;
}
server {
    listen       443  ssl;
    server_name blog-api.pangxuejun.cn;

    root /var/www/blog-api.pangxuejun.cn/public;

    ssl_certificate      /etc/nginx/cert/blog-api.pangxuejun.cn.pem;
    ssl_certificate_key  /etc/nginx/cert/blog-api.pangxuejun.cn.key;
    ssl_session_timeout  5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm index.php;

    charset utf-8;

    access_log   /var/log/nginx/blog-api.pangxuejun.cn.access.log;
    error_log    /var/log/nginx/blog-api.pangxuejun.cn.error.log;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
        if (!-e $request_filename) {
                rewrite  ^(.*)$  /index.php?s=$1  last;
                break;
        }
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
       include snippets/fastcgi-php.conf;

       fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}

方向代理
server{
       listen 80;
       charset utf-8;
       server_name blog-api.pangxuejun.cn;
       location / {
          proxy_pass http://127.0.0.1:8000;
          proxy_redirect default;
       }
}
server{
       listen 80;
       charset utf-8;
       server_name blog.pangxuejun.cn;
       location / {
          proxy_pass http://127.0.0.1:8080;
          proxy_redirect default;
       }
}
```

4.第五步
配置ssl证书/www/nginx/cert

参考：https://blog.csdn.net/BThinker/article/details/123507820