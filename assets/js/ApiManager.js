ApiManager = function(socket) {
    this.socket = socket;
    this.projects =
    this.init = function(){
        var self = this;
        this.socket.on('connect', function socketConnected() {
            self.socket.on('ready', function () {
                self.getContacts();
                self.getProjects();
            });
        });
    };

    this.getContacts = function() {
        console.log('getContacts');
        this.socket.get('/chat/contacts', function (res) {
            //res.groups.forEach(function (el) {
            //    if (!session.groups[el.id]) {
            //        session.groups[el.id] = el;
            //        $('#user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
            //            id: el.id,
            //            name: 'GROUP ' + el.name,
            //            avatar: '/images/tomas.jpg',
            //            type: 'room'
            //        }));
            //    }
            //});

            res.users.forEach(function (el) {
                if (!session.users[el.id]) {
                    session.users[el.id] = el;
                    $('#user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                        id: el.id,
                        name: el.name,
                        avatar: '/images/tomas.jpg',
                        type: 'user'
                    }));
                }
            });

            res.online.forEach(function (el) {
                if (!session.online[el.id])
                    session.online[el.id] = el;
                if ($('#user-' + el).length) {
                    $('#user-' + el + ' .figureimage').append(BoxyChat.loadTemplate('templates/chat/onlineUserTick.html'));
                }
            });
        });
    };

    this.getProjects = function() {
        var self = this;
        this.socket.get('/projects/own', function (res) {
            self.projects = res;
            $('#project-drop').html('');
            for(var i = 0; i < self.projects.length; ++i) {
                $('#project-drop').append('<li role="presentation"><a role="menuitem" tabindex="-1" href="/space/' + self.projects[i].slug +'">' + self.projects[i].name +'</a></li>');
            }
            eventManager.call('loaded');

        });
    };

    this.projectLookup = function(slug) {
        for(var i = 0; i < this.projects.length; ++i) {
            if(this.projects[i]["slug"] == slug) {
               return this.projects[i];
            }
        }
        return false;
    };

    this.getProjectContacts = function(id) {
        console.log('dio')
        this.socket.get('/chat/contacts/project/' + id, function (res) {
            console.log(res);
            res.groups.forEach(function (el) {
                if (!session.groups[el.id]) {
                    session.groups[el.id] = el;
                    $('#project-user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                        id: el.id,
                        name: 'GROUP ' + el.name,
                        avatar: '/images/tomas.jpg',
                        type: 'room'
                    }));
                }
            });

            res.users.forEach(function (el) {
                if (!session.users[el.id]) {
                    session.users[el.id] = el;
                    $('#project-user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                        id: el.id,
                        name: el.name,
                        avatar: '/images/tomas.jpg',
                        type: 'user'
                    }));
                }
            });

            res.online.forEach(function (el) {
                if (!session.online[el.id])
                    session.online[el.id] = el;
                if ($('#project-user-' + el).length) {
                    $('#project-user-' + el + ' .figureimage').append(BoxyChat.loadTemplate('templates/chat/onlineUserTick.html'));
                }
            });
        });
    };

    this.postMessage = function(type, id, message) {
        this.socket.post("/chat/" + type + "/" + id, {message: message}, function (res) {
            //TODO manage chat message return
        });
    };

    this.inviteUser = function(email) {
        this.socket.post('/request/invite/', {email: email}, function (res) {
            console.log(res)
        });
    }

    this.init();
}