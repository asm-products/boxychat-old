PageManager = function(page, apiManager) {
    this.page = page;
    this.apiManager = apiManager;

    this.init = function() {
        this.page.base('/space');
        this.page('/:project', this.loadProject);
        this.page.start();
    };

    this.loadProject = function(ctx, next) {
        addProgressBar();
        var project = this.apiManager.projectLookup(ctx.params.project);
        if(project) {
            $('.project-name').html(project.name);
            $('#project-user-list').empty();
            $('#project-contact-list').removeClass('hide');

            this.apiManager.getProjectContacts(project.id);
        }
        else {
            console.log('could not load page');
        }
        removeProgressBar();
    };

    this.init();
}