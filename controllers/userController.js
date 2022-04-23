const { ObjectId } = require('mongoose').Types;
const { regexpToText } = require('nodemon/lib/utils');
const { User, Thought } = require('../models');



const headCount = async () =>
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);

module.exports = {
    // get all users
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                    headCount: await headCount(),
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // get single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that id' })
                    : res.json({ user })
            )
            .catch((err) => {
                console.log(err);
                return res.statue(500).json(err);
            });
    },

    // create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    // update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { username: req.params.userId },
            { email: req.params.userId },
            { $pull: { username: req.params.userId } },
            { $pull: { email: req.params.userId } },
            { new: true }
        ).then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    // delete user
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No such user exists' })
                    : Thought.findOneAndUpdate(
                        { thoughtText: req.params.userId },
                        { $pull: { thoughtText: req.params.userId } },
                        { new: true }
                    )
            ).then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'User deleted',
                    })
                    : res.json({ message: 'User deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

};