# Estágio 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código e gera o build
COPY . .
RUN npm run build

# Estágio 2: Produção (Servindo com Nginx)
FROM nginx:stable-alpine

# Copia os arquivos gerados no build para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 (padrão web)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]