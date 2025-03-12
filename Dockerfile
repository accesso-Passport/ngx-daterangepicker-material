##########################################
#### Builds and publishes the library ####
##########################################

FROM node:18.20.3 AS npm-base

ARG CODEARTIFACT_AUTH_TOKEN

WORKDIR /usr/src/app
COPY ./package*.json ./

# Set the npm config so we can publish to CodeArtifact
RUN npm config set registry 'https://passport-407796645946.d.codeartifact.us-east-1.amazonaws.com/npm/npm-registry/'
RUN npm config set '//passport-407796645946.d.codeartifact.us-east-1.amazonaws.com/npm/npm-registry/:_authToken' ${CODEARTIFACT_AUTH_TOKEN}

# Install application dependencies
RUN npm ci --no-progress

FROM node:18.20.3 AS runtime

ARG CODEARTIFACT_AUTH_TOKEN

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

RUN npm config set '//passport-407796645946.d.codeartifact.us-east-1.amazonaws.com/npm/npm-private/:_authToken' ${CODEARTIFACT_AUTH_TOKEN}

# Run and build
RUN npm run build
