//session = {groups: [], users: [], online: []};
BoxyChat = {};

/**
 * Description
 * @method newChatContent
 * @param {} id
 * @param {} type
 * @return 
 */
BoxyChat.newChatContent = function(id, type) {
    var self = this;
    if(type == 'room')
        var sess = apiManager.session.groups[id];
    else if(type == 'user')
        var sess = apiManager.session.users[id];
    if(sess) {
        $('#chats').append(this.loadTemplate('templates/chat/defaultChat.html', { type: type, id: id, session: sess }));
        apiManager.getMessagesDirect(id);
    }
    else
        console.log("could not find");

    if(type == 'room') {
        apiManager.session.groups[id].users.forEach(function(ev) {
            console.log(ev)
            $('#chat-room-' + id + ' .avatar-stack').append(self.loadTemplate('templates/chat/avatarStack.html', ev));
        });
    }
};

/**
 * Description
 * @method getCurrentChatId
 * @return Literal
 */
BoxyChat.getCurrentChatId = function() {
    var $current = $('.chat-section').not('.hidden');
    if($current.length)
        return $current.attr('id').replace('chat-', '');
    else
        console.log('not current chat');
    return null;
};

BoxyChat.getCurrentChat = function() {
    return $('.chat-section').not('.hidden');
};

BoxyChat.scrollCurrentChat = function() {
    var $current = BoxyChat.getCurrentChat();
    var message = $current.find('.chat');
    message.scrollTop(message.get(0).scrollHeight);
};

BoxyChat.handleHistoryMessage = function(msg, type) {
    var id = msg.chatId;
    msg.msg = msg.message;
    var original = {msg: msg.message};
    console.log('#chat-' + type +'-' + id + ' .chat-messages');
    $('#chat-' + type +'-' + id + ' .chat-messages').prepend(BoxyChat.loadTemplate('templates/chat/messageOther.html', {css: 'opaque', message: eventManager.call('textMessage', msg).msg + "<div>" + eventManager.call('textMessageAfter', original).msg + "</div>", name: apiManager.session.users[msg.owner].name, id: msg.owner, avatar: '/images/tomas.jpg'}));
    BoxyChat.scrollCurrentChat();
};

BoxyChat.handleOwnHistoryMessage = function(msg, type) {
    var id = msg.chatId;
    msg.msg = msg.message;
    $('#chat-' + type + '-' + id + ' .chat-messages').prepend("<div class='message message-right no-figure opaque'><div class='bubble no-triangle'>" + eventManager.call('textMessage', msg).msg + "<div>" + eventManager.call('textMessageAfter', msg).msg + "</div></div><div style='clear:both'></div></div>");
    BoxyChat.scrollCurrentChat();
};
BoxyChat.handleNewMessage = function(msg, type) {
    console.log('handle')
    console.log(msg)
    var original = {msg: msg.msg};
    var id = msg.room ? msg.room.id : msg.from;
    if (!$('#chat-' + type + '-' + id).length)
        BoxyChat.newChatContent(id, type);
    $('#chat-' + type +'-' + id + ' .chat-messages').append(BoxyChat.loadTemplate('templates/chat/messageOther.html', {css: '', message: eventManager.call('textMessage', msg).msg + "<div>" + eventManager.call('textMessageAfter', original).msg + "</div>", name: apiManager.session.users[msg.from].name, id: msg.from}));
    if (BoxyChat.getCurrentChatId() != type + '-' + id) {
        $('#' + type + '-' + id + ' .figureimage .ic').addClass('hidden');
        var $counter = $('#' + type + '-' + id + ' .figureimage .number');
        $counter.html(parseInt($counter.html()) + 1).removeClass('hidden');
    }
    else
        BoxyChat.scrollCurrentChat();
}
/**
 * Description
 * @method loadTemplate
 * @param {} templatePath
 * @param {} data
 * @return templateString
 */
BoxyChat.loadTemplate = function(templatePath, data) {
    var templateString = window['JST'][templatePath](data);
    return templateString;
};