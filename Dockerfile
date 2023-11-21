FROM node:19-alpine
WORKDIR /app
COPY . .
RUN yarn install
COPY .env.example .env
RUN yarn build
EXPOSE 4001
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["sh", "./entrypoint.sh"]