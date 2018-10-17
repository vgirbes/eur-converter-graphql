FROM node:10

ARG HOME_DIR

RUN mkdir -p $HOME_DIR
COPY src/* $HOME_DIR

RUN npm install -g nodemon
RUN cd $HOME_DIR && npm install

CMD ["nodemon", "app.js"]