'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function test(request, response) {
    response.status(200).send({ message: 'Ruta de pruebas de servidor NodeJS' })
}

function saveFollow(request, response) {
    var params = request.body;
    var follow = new Follow();
    follow.user = request.user.sub;
    follow.followed = params.followed;
    follow.save((err, followStored) => {
        if (err) {
            return response.status(500).send({ message: 'Error: No se pudo guardar el follow.' });
        }
        if (!followStored) {
            return response.status(404).send({ message: 'Error: No se guardó el follow.' });
        }
        return response.status(200).send({ follow: followStored });
    });
}

function deleteFollow(request, response) {
    var userId = request.user.sub;
    var followId = request.params.id;
    Follow.find({
        'user': userId,
        'followed': followId
    }).remove(err => {
        if (err) return response.status(500).send({ message: 'Error: No se pudo eliminar el follow.' });
        response.status(200).send({ message: 'El follow se ha eliminado' });
    });
}

function getFollowingUsers(request, response) {
    var userId = request.user.sub;
    if (request.params.id && request.params.page) {
        userId = request.params.id;
    }
    var page = 1;
    if (request.params.page) {
        page = request.params.page;
    } else {
        page = request.params.id;
    }

    var itemsPerPage = 4;
    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return response.status(500).send({ message: 'Error: No se pudo obtener los follows.' });
        if (!follows) return response.status(404).send({ message: 'Error: No obtuvo los follows.' });
        //delete follows.password;
        response.status(200).send({
            total,
            pages: Math.ceil(total / itemsPerPage),
            following: follows
        });
    });
}

function getFollowerUsers(request, response) {
    var userId = request.user.sub;

    if (request.params.id && request.params.page) {
        userId = request.params.id;
    }

    var page = 1;

    if (request.params.page) {
        page = request.params.page;
    } else {
        page = request.params.id;
    }

    var itemsPerPage = 4;

    Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return response.status(500).send({ message: 'Error: No se pudo obtener los follows.' });
        if (!follows) return response.status(404).send({ message: 'Error: No hay seguidores.' });
        response.status(200).send({
            total,
            pages: Math.ceil(total / itemsPerPage),
            follower: follows
        });
    });
}

function getMyFollows(request, response) {
    var userId = request.user.sub;

    var find = Follow.find({ user: userId });

    if (request.params.followed) {
        find = Follow.find({ followed: userId });
    }

    find.populate('user followed').exec((err, follows) => {
        if (err) return response.status(500).send({ message: 'Error: No se pudo obtener los follows.' });
        if (!follows) return response.status(404).send({ message: 'Error: No sigues a ningún usuario.' });
        response.status(200).send({ follows });
    });
}

module.exports = {
    test,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowerUsers,
    getMyFollows
}