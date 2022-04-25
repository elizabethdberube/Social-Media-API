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
        User.findOne({ _id: id })
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

    // add a friend
    addFriend(req, res) {
        console.log('You added a friend!');
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { firends: req.body } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'no user with that id' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // remove a friend
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { friendsId: req.params.friendsId } } },
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found with this ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};