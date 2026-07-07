FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set dynamic production API endpoint
ARG NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
