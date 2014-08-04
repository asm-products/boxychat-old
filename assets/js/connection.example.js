//
//bla.set('test', function(data) {
//    return data + " world"
//});
//bla.set('test', function(data) {
//    return data + "!!!"
//});
//bla.set('test', function(data) {
//    console.log("POSTED to Twitter: " + data);
//}, true);
//
//console.log(bla.call('test', "hello"));
function getUrls(text) {

    var links = new Array();
    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
    while (match = urlPattern.exec(text.msg)) {
        asd = testUrlForMedia(match[0])
        if (asd)
            links.push(asd);
    }
    var pseudoUrlPattern = /^(www\.[\S]+(\b|$))/gim;
    while (match = pseudoUrlPattern.exec(text.msg)) {
        asd = testUrlForMedia('http://' + match[0])
        if (asd)
            links.push(asd);
    }

    var html = '';
    for (var i in links) {
        links[i]
        if (links[i].type === 'youtube') {
            html += '<object width="640" height="360"><param name="movie" value="http://www.youtube.com/v/' + links[i].id + '?hl=en_US&rel=0&hd=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/' + links[i].id + '?hl=en_US&rel=0&hd=1" type="application/x-shockwave-flash" width="640" height="360" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
        }
        if (links[i].type === 'soundcloud') {
            html += '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + links[i].url + '&show_artwork=true"></iframe>';
        }
        if (links[i].type === 'vimeo') {
            html += '<iframe src="//player.vimeo.com/video/' + links[i].id + '" width="500"  height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        }
    }
    text.msg = html;
    return text;
}

function testUrlForMedia(pastedData) {
    var success = false;
    var media = {};
    if (pastedData.match('http://(www.)?youtube|youtu\.be')) {
        if (pastedData.match('embed')) {
            youtube_id = pastedData.split(/embed\//)[1].split('"')[0];
        }
        else {
            youtube_id = pastedData.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
        }
        media.type = "youtube";
        media.id = youtube_id;
        success = true;
    }
    else if (pastedData.match('http://(player.)?vimeo\.com')) {
        vimeo_id = pastedData.split(/video\/|http:\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
        media.type = "vimeo";
        media.id = vimeo_id;
        success = true;
    }
    else if (pastedData.match('https?://(www.)?soundcloud\.com')) {
        var re = /^https?:\/\/(?:www\.)?soundcloud\.com\/[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*(?!\/sets(?:\/|$))(?:\/[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*){1,2}\/?$/i;
        if (re.test(pastedData)) {
            media.type = "soundcloud";
            media.url = pastedData;
            success = true;
        }
    }
    if (success) {
        return media;
    }

    return false;
}

function in_array(e, t, n) {
    var r = "", i = !!n;
    if (i) {
        for (r in t) {
            if (t[r] === e) {
                return true
            }
        }
    } else {
        for (r in t) {
            if (t[r] == e) {
                return true
            }
        }
    }
    return false
}

function parseStrSkippingTags(txt, callback) {
    var opentag = '<',
        closetag = '>',
        strtags = ['"', "'"],
        curstrtype = '',
        curstd = '',
        std = '',
        length = txt.length,
        i = 0,
        curchar = '',
        intag = false,
        intstr = false;

    for (; i < length; i++) {
        curchar = txt[i];
        if (intag) {
            if (intstr && curchar == curstrtype) {
                intstr = false;
            } else if (!intstr && in_array(curchar, strtags)) {
                curstrtype = curchar;
                intstr = true;
            } else if (!intstr && curchar == closetag) {
                intag = false;
            }

            std += curchar;

        } else {
            if (curchar == opentag) {
                intag = true;
                if (callback && curstd) curstd = callback(curstd);
                std += curstd;
                std += curchar;
                curstd = '';
            } else {
                curstd += curchar;
            }
        }
    }

    if (callback && curstd) curstd = callback(curstd);
    if (curstd) std += curstd;

    return std;

}


function linkify(data) {

    //var a = $(data.msg).linkify();
    //var e = new Linkified($(data.msg))

    data.msg = parseStrSkippingTags(data.msg, function (str) {
        console.log(str)
        return linkify2(str);
    });

    return data;
}
function linkify2(msg) {

    // http://, https://, ftp://
    var urlPattern = /(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    var emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;

    msg = msg
        .replace(urlPattern, '<a href="$&">$&</a>')
        .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
        .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');

    return msg;
};
function textToImg(data) {
    data.msg = data.msg.replace(/(http:\/\/[\w\-\.]+\.[a-zA-Z]{2,3}(?:\/\S*)?(?:[\w])+\.(?:jpg|png|gif|jpeg|bmp))/ig, "<span><img src='$1' alt='' class='thumblightbox' style='width: 250px;'></span>");
    return data;
}

eventManager.set('textMessage', textToImg);
eventManager.set('textMessage', linkify);

eventManager.set('textMessageAfter', getUrls);


// Immediately start connecting
socket = io.connect();

console.log('Connecting Socket.io to Sails.js...');

//event 'message' when we receive a message
socket.on('message', function (msg) {
    BoxyChat.handleNewMessage(msg, 'user');
//    if (!$('#chat-user-' + msg.from).length)
//        BoxyChat.newChatContent(msg.from, 'user');
//    $('#chat-user-' + msg.from + ' .chat-messages').append(BoxyChat.loadTemplate('templates/chat/messageOther.html', {message: msg.msg, name: session.users[msg.from].name, avatar: '/images/tomas.jpg'}));
//    if (BoxyChat.getCurrentChatId() != 'user-' + msg.from) {
//        $('#user-' + msg.from + ' .figureimage .icon-check').addClass('hidden');
//        var $counter = $('#user-' + msg.from + ' .figureimage .number');
//        $counter.html(parseInt($counter.html()) + 1).removeClass('hidden');
//    }
//    else
//        BoxyChat.scrollCurrentChat();
});

socket.on('group', function (msg) {
    if (msg.verb == 'messaged') {
        BoxyChat.handleNewMessage(msg.data, 'room');

    }
    //console.log(nol);
    console.log(msg);
});

socket.on('updated', function (msg) {
    console.log('updated');
    console.log(msg);
});

//event 'user' when a user changes status (online/offline)
socket.on('user', function (msg) {
    console.log("jdei")
    if (msg.data.type == 'userStatus') {
        console.log(msg)
        if ($('#user-' + msg.data.id).length && !$('#room-' + msg.data.id + ' .test').length) {
            $('#user-' + msg.data.id + ' .figureimage').append(BoxyChat.loadTemplate('templates/chat/onlineUserTick.html'));
        }
    }

});

// on connect we get the available conversations (user/group list)
socket.on('connect', function socketConnected() {
    socket.on('ready', function () {
        socket.get('/chat/conversations', function (res) {
            res.groups.forEach(function (el) {
                if (!session.groups[el.id]) {
                    session.groups[el.id] = el;
                    $('#user-list').append(BoxyChat.loadTemplate('templates/chat/userListEntry.html', {
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
    });
});

//on press ENTER key on the message text field it will send the message
$(document).on('keypress', '.message-text', function (ev) {
    if (ev.which === 13 && $.trim($(this).val()).length > 0) {
        ev.preventDefault();

        var id = $(this).attr('id');
        var type = id.substring(5, 9);

        var chatType = 'private';
        if (type == 'room')
            chatType = 'room';
        socket.post("/chat/" + chatType + "/" + id.replace('text-' + type + '-', ''), {message: $(this).val()}, function (res) {
            console.log(res);
        });

        $('#chat-' + id.replace('text-', '') + ' .chat-messages').append("<div class='message message-right no-figure'><div class='bubble no-triangle'>" + eventManager.call('textMessage', {msg: $(this).val()}).msg + "<div>" + eventManager.call('textMessageAfter', {msg: $(this).val()}).msg + "</div></div></div>");
        $(this).val('');
        BoxyChat.scrollCurrentChat();
    }
});

//on click on a user/group will create, if necessary, and open the conversation
$(document).on('click', '.chat-conversation', function (ev) {
    var id = $(this).attr('id');
    var type = id.substring(0, 4);
    if (!$('#chat-' + id).length) {
        BoxyChat.newChatContent(id.replace(type + '-', ''), type);
        $('.chat-section').addClass('hidden');
        $('#chat-' + id).removeClass('hidden');
    }
    else {
        $('.chat-section').addClass('hidden');
        $('#chat-' + id).removeClass('hidden');
    }

    BoxyChat.scrollCurrentChat();
    $('#' + id + ' .figureimage .number').addClass('hidden').html("0");
    $('#' + id + ' .figureimage .ic').removeClass('hidden');
});

$(document).on('click', '.videochatbtn', function (ev) {
    var id = $(this).attr('id');
    var type = id.substring(6, 10);
    var numid = id.replace('video-' + type + '-', '');
    var $videochat = $('#chat-' + id.replace('video-', '') + ' .videochat');
    var $chat = $('#chat-' + id.replace('video-', '') + ' .chat');
    if ($videochat.hasClass('hidden')) {
        $videochat.removeClass('hidden');
        $chat.addClass("space-video");
    }
    else {
        $videochat.addClass('hidden');
        $chat.removeClass("space-video");
    }
});
$(document).on('click', '.tpmenu', function (ev) {
    $('.menuLabel').addClass('hidden');
    $('.tpmenu').removeClass('active');
    var val = $(this).addClass('active').find('.menuLabel').removeClass('hidden').html();
    $('.centrals').addClass('hidden');
    if($('#' + val.toLowerCase()).length)
        $('#' + val.toLowerCase()).removeClass('hidden');
});