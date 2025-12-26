# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建参数（可选，用于注入环境变量）
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 构建
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# 安装 envsubst 用于环境变量替换
RUN apk add --no-cache gettext

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置模板
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 设置默认环境变量
ENV API_UPSTREAM=http://yicheng-api:8080

# 暴露端口
EXPOSE 80

# 启动时替换环境变量并启动 nginx
CMD ["/bin/sh", "-c", "envsubst '${API_UPSTREAM}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
