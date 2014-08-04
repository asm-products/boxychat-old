var session = {groups: [], users: [], online: []};
BoxyChat = {};

/**
 * Description
 * @method newChatContent
 * @param {} id
 * @param {} type
 * @return 
 */
BoxyChat.newChatContent = function(id, type) {
    console.log(id)
    console.log(type)
    if(type == 'room')
        var sess = session.groups[id];
    else if(type == 'user')
        var sess = session.users[id];
    if(sess)
        $('#chats').append(this.loadTemplate('templates/chat/defaultChat.html', { type: type, id: id, session: sess }));
    else
        console.log("could not find");
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

BoxyChat.handleNewMessage = function(msg, type) {
    var original = {msg: msg.msg};
    var id = msg.room ? msg.room.id : msg.from;
    if (!$('#chat-' + type + '-' + id).length)
        BoxyChat.newChatContent(id, type);
    $('#chat-' + type +'-' + id + ' .chat-messages').append(BoxyChat.loadTemplate('templates/chat/messageOther.html', {message: eventManager.call('textMessage', msg).msg + "<div>" + eventManager.call('textMessageAfter', original).msg + "</div>", name: session.users[msg.from].name, avatar: '/images/tomas.jpg'}));
    if (BoxyChat.getCurrentChatId() != type + '-' + msg.from) {
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