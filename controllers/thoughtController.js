const { User, Thought } = require('../models');


module.exports = {

    // get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    // get single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No Though with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // create a thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                User.findOneAndUpdate(
                    { _id: req.body.user },
                    { $push: { thoughts: thought._id } },

                ).then((user) => {

                    console.log(thought._id)
                    console.log(user)

                });
                res.json(thought);
            }
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });

    },

    // update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidator: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).jcon(err));
    },

    // delete a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : Thought.deleteMany({ _id: { $in: thought.users } })
            )
            .then(() => res.json({ message: 'Thought deleted' }))
            .catch((err) => res.status(500).json(err));
    },

    // add a reaction
    addReaction(req, res) {
        console.log('You added a reaction');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: { reactionBody: req.body.reactionBody, user: req.body.user } } },
            { runValidators: true, new: true },

        )
            .then((thought) =>

                !thought
                    ? res.status(404)
                        .json({ message: 'no thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500));
    },

    // remove a reaction
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactions: req.params.reactionId } } },

        )
            .then((thought) =>
                !thought
                    ? res
                        .status(404)
                        .json({ message: 'No reaction found with this ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

};