# Dockerfile to create a dnrdw image
FROM node
MAINTAINER leapon

# Add files to the image
RUN mkdir -p /opt/nodejs
ADD . /opt/nodejs
WORKDIR /opt/nodejs

# Install the dependencies modules
RUN npm install

# Expose environment variables
ENV LEAPBASE_HTTP_PORT=8000

# Expose the container port
EXPOSE 8000

ENTRYPOINT ["npm", "start"]

