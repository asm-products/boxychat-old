/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        name: {
            type: 'string'
        },
        type: {
            type: 'string',
            index: true
        },
        project: {
            model: 'Project'
        },
        users: {
            type: 'array',
            index: true
        },
        owner: {
            model:'user'
        }
    }
};

