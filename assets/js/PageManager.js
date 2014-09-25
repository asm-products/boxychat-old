PageManager = function(page, apiManager) {
    this.page = page;
    this.apiManager = apiManager;

    this.init = function() {
        this.page.base('/space');
        this.page('/account/:type?', this.loadAccount, this.blocker);
        this.page('/:project', this.loadProject, this.blocker);
        this.page('/:project/account/:type?', this.loadProject, this.loadAccount, this.blocker);
        this.page.start();
    };

    this.blocker = function(ctx, next) {

    };

    this.loadProject = function(ctx, next) {
        console.log('loadProject')
        addProgressBar();

        if(projectName != ctx.params.project) {
            projectName = ctx.params.project;
            var project = this.apiManager.projectLookup(ctx.params.project);
            if (project) {

                $('.project-name').html(project.name);
                $('#project-user-list').empty();
                $('#project-contact-list').removeClass('hide');

                this.apiManager.getProjectContacts(project.id);
            }
            else {
                console.log('could not load page');
            }
        }
        removeProgressBar();
        next();
    };

    this.loadAccount = function(ctx, next) {
        console.log('loadAccount')
        addProgressBar();

        $('.account-menu').removeClass('active');

        $('#account-content').empty();
        if(ctx.params.type) {
            var type = ctx.params.type;
            type = type.toLowerCase();
            $('#account-content').append(BoxyChat.loadTemplate('templates/account/' + type + '.html'));
            $("[data-switch]").bootstrapSwitch({
                "size": "small"
            });
            $('#account-menu-' + type).addClass('active');
        }
        else {
            $('#account-content').append(BoxyChat.loadTemplate('templates/account/profile.html'));
            $('#account-menu-profile').addClass('active');

            // Calling jQuery "droparea" plugin
            $('.uploaderAvatar').droparea({
                'init' : function(result){
                    //console.log('custom init',result);
                },
                'start' : function(area){
                    area.find('.error').remove();
                },
                'error' : function(result, input, area){
                    $('<div class="error">').html(result.error).prependTo(area);
                    return 0;
                    //console.log('custom error',result.error);
                },
                'complete' : function(result, file, input, area){
                    if((/image/i).test(file.type)){
                        area.find('img').remove();
                        //area.data('value',result.filename);
                        updateAvatar(userId);

                        //area.append($('<img>',{'src': result.path + result.filename + '?' + Math.random()}));
                    }
                    //console.log('custom complete',result);
                }
            });
        }

        $('.menuLabel').addClass('hidden');
        $('.tpmenu').removeClass('active');
        $('.menu-account').removeClass('hidden').parent().parent().addClass('active');

        $('.centrals').addClass('hidden');
        $('#account').removeClass('hidden');
        removeProgressBar();
    };
    this.init();
}