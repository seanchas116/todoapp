FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN npm run prisma:generate
CMD [ "sh", "start.sh" ]
