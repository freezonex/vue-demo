# 基础镜像
FROM nginx
# 拷贝nginx配置文件到镜像
COPY default.conf /etc/nginx/conf.d/
# 拷贝应用文件到镜像
COPY dist /usr/share/nginx/html