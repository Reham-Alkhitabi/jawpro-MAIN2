FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN cd ../gp && npm install && npm run build && cp -r build ../backend/build

CMD ["node", "index.js"]
