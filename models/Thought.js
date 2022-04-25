const { Schema, Types } = require('mongoose');
const mongoose = require('mongoose');

// reaction schema
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
},
    {
        toJSON: {
            getters: true,
        },
        id: false,

    })

// reaction data
const reactionData = [
    { reactionBody: 'yay!' },
    { reactionBody: 'excited!' },
    { reactionBody: 'so nice' },
];

// thought schema
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        maxlength: 280,
        minlength: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
    {
        toJSON: {
            getters: true,
        },

        reactions: [reactionSchema],
    },
)

const Thought = mongoose.model('Thought', thoughtSchema);

// create a new instance
Thought.create({ name: 'Reactions', reactions: reactionData }, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

module.exports = Thought; 