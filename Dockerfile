##########################################
#### Builds and publishes the library ####
##########################################

FROM node:18.20.3 AS npm-base

WORKDIR /usr/src/app

COPY ./package*.json ./

# Install application dependencies
RUN npm ci

FROM node:18.20.3 AS runtime

# Need to switch to archive due to us using NodeJS 14.17
RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list
RUN apt update && apt install -y git

WORKDIR /usr/src/app

COPY --from=npm-base /usr/src/app/node_modules ./node_modules
COPY ./ ./

RUN git status

# Build and version
RUN git config --global user.email "jenkins@accesso.com"
RUN git config --global user.name "accesso-jenkins"

# Run and build
RUN npm run build

RUN rm -rf dist
