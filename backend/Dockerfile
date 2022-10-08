FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN npx prisma generate
EXPOSE 4000
CMD [ "node", "dist/index.js" ]
