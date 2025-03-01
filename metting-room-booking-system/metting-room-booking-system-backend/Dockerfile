FROM node:18.12-alpine as build-stage
WORKDIR /app
COPY package.json . 
RUN npm install -g pnpm
RUN pnpm config set registry  https://registry.npmmirror.com/
RUN pnpm install
COPY . .
RUN pnpm run build

# production stage 
FROM node:18.12-alpine as production-stage
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
WORKDIR /app

RUN npm install -g pnpm
RUN pnpm config set registry  https://registry.npmmirror.com/
RUN pnpm install --production
EXPOSE 3005
CMD ["node","/app/main.js"]