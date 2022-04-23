const router = require('express').Router();

const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:usersId
router.route('/:usersId')
    .get(getSingleUser)
    .post(createUser)
    .put(updateUser)
    .delete(deleteUser);

// /users/:userId/friend  
router.route('/:userId/friend').post(addFriend);

// /users/:userId/friend/:friendId 
router.route('/:userId/friend/:friendId').delete(removeFriend);

module.exports = router;


















