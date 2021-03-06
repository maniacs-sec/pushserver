FROM node:argon-stretch

RUN npm install -g bower
RUN npm install -g gulp-cli

ENV user pushserver
#ENV NODE_ENV production
RUN groupadd --system $user && useradd --system --create-home --gid $user $user

# Create app directory
RUN mkdir -p /home/$user/pushserver
WORKDIR /home/$user/pushserver

# Install app dependencies
COPY package.json /home/$user/pushserver
RUN npm install

# Bundle app source
COPY . /home/$user/pushserver
RUN mkdir /home/$user/db /home/$user/logs
RUN chown -R $user:$user /home/$user
USER $user
RUN bower install
RUN gulp build
RUN gulp syncDb

VOLUME ["/home/$user/db"]
VOLUME ["/home/$user/logs"]
EXPOSE 3000
CMD [ "gulp", "watch" ]
