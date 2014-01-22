/* jshint indent:2, node:true */

(function() {
  "use strict";

  var IO, PORT, app, express, fs, http, path, routes, server;

  require('coffee-script');

  require('colors');

  express = require("express");

  http = require("http");

  path = require("path");

  fs = require("fs");

  routes = require("./routes");

  app = express();

  server = http.createServer(app);

  IO = require("socket.io").listen(server);

  PORT = process.env.PORT || 5000;

  app.configure(function() {
    app.set("port", process.env.PORT || PORT);
    app.set("views", "" + __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express["static"](path.join(__dirname, "public/")));
    return;
  });

  app.configure("development", function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    app.locals.pretty = true;
    return;
  });

  app.configure("production", function() {
    app.use(express.errorHandler());
    return;
  });

  app.get("/", routes.index);

  if (!module.parent) {
    server.listen(app.get("port"), function() {
      console.log(("\n\n==================================================\nExpress server running on: http://localhost:" + (app.get("port")) + "\n==================================================").green);
      return;
    });
  }

  IO.configure("development", function() {
    IO.set("log level", 2);
    return;
  });

  IO.configure("production", function() {
    IO.set("transports", ["websocket", "flashsocket", "htmlfile", "xhr-polling", "jsonp-polling"]);
    IO.set("polling duration", 3);
    IO.enable("browser client minification");
    IO.enable("browser client etag");
    IO.enable("browser client gzip");
    IO.set("log level", 1);
    return;
  });

  IO.sockets.on("connection", function(socket) {
    socket.on("player:join", function() {
      console.log('new player joined');
    });
    return;
  });

}).call(this);
