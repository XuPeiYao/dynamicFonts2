FROM node:10

# 切換工作目錄
WORKDIR /app

# 安裝NPM套件
RUN npm install

# 複製檔案
COPY . .

# 輸出Port 80
EXPOSE 80

# 字體目錄
VOLUME [ "/app/fonts" ] 

# 啟動程式
CMD [ "npm", "start" ]