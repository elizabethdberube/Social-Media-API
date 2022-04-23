const { Schema, Types } = require('mongoose');
const { Thought, User } = require('../models');

// User schema

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            email: {
                type: String,
                required: true,
                match: /.+\@.+\..+/,
                unique: true,
            },
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        },
        ],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }

)

userSchema.virtual('friendCount', {
    ref: 'User',
    localField: 'friends',
    foreignField: '_id',
});

const User = model('user', userSchema);

module.exports = User; 