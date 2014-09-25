ApiManager = function(socket) {
    this.socket = socket;
    this.projects ={};
    console.log('aaaa')
    this.session = {groups: {}, users: {}, online: {}};
    this.test = "test";
    this.init = function(){
        var self = this;
        self.configure();

        this.socket.on('connect', function socketConnected() {

        });
    };

    this.configure = function() {
        console.log('configure')
        var self = this;
        this.socket.on('ready', function () {
            self.getContacts();
            self.getProjects();
        });

        this.socket.on('notification', function(data) {
            console.log(data);
            data.icon = 'fa-user';
            data.projectName = '';
            $('#notification-list').prepend(BoxyChat.loadTemplate('templates/chat/singleNotification.html', data));
            test();
        });

        this.socket.on('contact', function(data) {
            if (!self.session.users[data.id]) {
                self.session.users[data.id] = data;
                $('#user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                    id: data.id,
                    name: data.name,
                    avatar: '/images/tomas.jpg',
                    type: 'user'
                }));
            }
            });

        this.socket.on('message', function (msg) {
            console.log(msg)
            if(msg.verb == 'update' && msg.data.type == 'userAvatar') {
                console.log('ddeuhd')
                updateAvatar(msg.data.id);
            }
            if(!msg.verb)
                BoxyChat.handleNewMessage(msg, 'user');
        });

        this.socket.on('group', function (msg) {
            if (msg.verb == 'messaged') {
            BoxyChat.handleNewMessage(msg.data, 'room');
        }
        this.socket.on('user', function(msg) {
            console.log('niniudhuhdeuhduehude')
            console.log(msg)
            if(msg.verb == 'updated' && msg.data.type == 'userAvatar') {
                updateAvatar(msg.data.id);
            }
        })
    });
    };

    this.acceptNotification = function(id) {
        this.socket.post('/notification/accept', {id: id}, function(res) {
            console.log(res)
        });
    };
    this.getContacts = function() {
        console.log('getContacts');
        var self = this;
        this.socket.get('/chat/contacts', function (res) {
            console.log(res);
            res.groups.forEach(function (el) {
                if (!self.session.groups[el.id]) {
                    self.session.groups[el.id] = el;
                    $('#user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                        id: el.id,
                        name: el.name,
                        avatar: '/images/tomas.jpg',
                        type: 'room'
                    }));
                }
            });

            res.users.forEach(function (el) {
                if (!self.session.users[el.id]) {
                    self.session.users[el.id] = el;
                    $('#user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                        id: el.id,
                        name: el.name,
                        avatar: '/images/tomas.jpg',
                        type: 'user'
                    }));
                }
            });

            res.online.forEach(function (el) {
                if (!self.session.online[el.id])
                    self.session.online[el.id] = el;
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
                $('#project-drop').append('<li><a class="project-link" href="/space/' + self.projects[i].slug +'">' + self.projects[i].name +'</a></li>');
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
        var self = this;
        this.socket.get('/chat/contacts/project/' + id, function (res) {
            console.log(res);
            res.groups.forEach(function (el) {
                if (!self.session.groups[el.id]) {
                    self.session.groups[el.id] = el;
                    $('#project-user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                        id: el.id,
                        name: 'GROUP ' + el.name,
                        avatar: '/images/tomas.jpg',
                        type: 'room'
                    }));
                }
            });

            res.users.forEach(function (el) {
                if (!self.session.users[el.id]) {
                    self.session.users[el.id] = el;
                    $('#project-user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                        id: el.id,
                        name: el.name,
                        avatar: '/images/tomas.jpg',
                        type: 'user'
                    }));
                }
            });

            res.online.forEach(function (el) {
                if (!self.session.online[el.id])
                    self.session.online[el.id] = el;
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

    this.getMessagesDirect = function(id) {
        console.log('directmessages')
        this.socket.get('/history/private/' + id, function(res) {
            $('#chat-user-' + id + ' .chat-messages').prepend('<div class="message-hr"><span>Today, 20:52 PM</span></div>');
            res.forEach(function(e) {
                e.chatId = id;
                if(e.owner == id) {
                    BoxyChat.handleHistoryMessage(e, 'user');
                }
                else {
                    BoxyChat.handleOwnHistoryMessage(e, 'user');
                }
            });
            console.log(res);

        });
    }
    this.inviteUser = function(email) {
        console.log('djejdeu')
        this.socket.post('/request/invite/', {email: email}, function (res) {
            res.forEach(function(ev) {
                console.log(ev.name)
            });
        });
    };

    this.createRoom = function(roomName) {
        var self = this;
        this.socket.post('/groups', {name: roomName}, function (res) {
            self.session.groups[res.id] = res;
            $('#user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
                id: res.id,
                name: 'GROUP ' + res.name,
                avatar: '/images/tomas.jpg',
                type: 'room'
            }));
            $('#room-' + res.id).click();
        });
    };

    this.inviteToGroup = function(groupId, userId) {
        var self = this;
        this.socket.put('/group/' + groupId + '/user', {userId: userId}, function(res) {
            console.log(res)
        });
    }
    this.init();
}