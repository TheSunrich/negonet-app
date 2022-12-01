const admin = require('firebase-admin');
const express = require('express');

admin.initializeApp();

exports.createUser = require("./user").createUser;
exports.updateUser = require("./user").updateUser;
exports.deleteUser = require("./user").deleteUser;
exports.getUser = require("./user").getUser;
exports.getUsers = require("./user").getUsers;
