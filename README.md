# Popcorn Saver Client

Popcorn Saver is a movie recommendation web application developed as a project for 2IMW15: Web Information Retrieval and Data Mining, during the first quartile of the 2015/2016 academic year at TU Eindhoven. It was developed using the [Movielens 100K](http://grouplens.org/datasets/movielens/) dataset.

This code corresponds to the web client, which provides a single page GUI that consumes services exposed by the other components. Therefore, the server and recommender modules should be running for it to be fully functional.

### Requirements
* NodeJS. Installers can be found here: https://nodejs.org/en/download/
* https://github.com/rparrapy/popcorn-saver-server
* https://github.com/rparrapy/popcorn-saver-recommender
### Installation
1. Clone the project.
```sh
$ git clone https://github.com/rparrapy/popcorn-saver-client.git && cd popcorn-saver-client
```
2. Install developer tools.
```sh
$ npm install -g yo gulp bower
```
3. Install project dependencies.
```sh
$ npm install && bower install
```
4. Run the development web server.
```sh
$ gulp serve
```

The maintenance server should be running on port 3000.

### Deployment
```sh
$ gulp build
```
And copy the *dist* folder content to a production suitable web server such as Apache or Nginx.
