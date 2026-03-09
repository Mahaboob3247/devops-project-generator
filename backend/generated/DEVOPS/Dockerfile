FROM node:20
WORKDIR /app
COPY . .
RUN npm install || true
EXPOSE 3000
CMD ["node","app.js"]