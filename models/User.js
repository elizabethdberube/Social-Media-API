const { Schema, model } = require('mongoose');

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
    }
)

// virtual
userSchema.virtual('friendCount', {
    ref: 'User',
    localField: 'friends',
    foreignField: '_id',
});

const User = model('user', userSchema);

module.exports = User; 