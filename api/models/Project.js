/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var slug = require('slug');
module.exports = {

    attributes: {
        name:{
            type: 'String'
        },
        slug: {
            type: 'String',
            index: true,
            unique: true
        },
        type: {
            type: 'String'
        },
        conversation: {
            type: 'String'
        },
        owner: {
            type: 'String'
        },
        people: {
            type: 'Array',
            index: true
        },
        groups: {
            collection: 'Group',
            via: 'project'
        }
    },
    beforeCreate: function (project, cb) {
        project.slug = slug(project.name);
        return cb(null, project);
    }
};