App = Ember.Application.create();

App.Router.map(function () {
    this.resource("about");
    this.resource("posts", function () {
        this.resource("post", { path: ":post_id" });
    });
});

App.PostsRoute = Ember.Route.extend({
    model: function () {
        return $.getJSON("http://tomdale.net/api/get_recent_posts/?callback=?").then(function (data) {
            return data.posts.map(function (post) {
                post.body = post.content;
                return post;
            });
        });
    }
});

App.PostRoute = Ember.Route.extend({
    model: function (params) {
        return $.getJSON("http://tomdale.net/api/get_post/?id=" + params.post_id + "&callback=?").then(function (data) {
            data.post.body = data.post.content;
            return data.post;
        });
    }
});

App.PostController = Ember.ObjectController.extend({
    isEditing: false,

    actions: {
        edit: function () {
            this.set("isEditing", true);
        },

        doneEditing: function () {
            this.set("isEditing", false);
        }
    }
});

Ember.Handlebars.helper("format-date", function (date) {
    return moment(date).fromNow();
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper("format-markdown", function (input) {
    return new Handlebars.SafeString(showdown.makeHtml(input));
});

//var posts = [
//    {
//        id: 1,
//        title: "Rails is Omakase",
//        author: {
//            name: "d2h"
//        },
//        date: new Date("12-27-2012"),
//        excerpt: "In ut augue justo. Nunc ut risus faucibus purus egestas ultrices....",
//        body: "In ut augue justo. Nunc ut risus faucibus purus egestas ultrices. Nunc suscipit porta nulla ut gravida. Donec vulputate, lectus id vehicula vestibulum, quam sapien vestibulum massa, non vestibulum enim velit vel nisl. In in iaculis risus. Morbi at gravida massa. Integer elementum mi egestas, adipiscing ante non, consectetur dui. Suspendisse ultricies vestibulum ante at feugiat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas quam mi, facilisis a molestie vehicula, feugiat ac neque."
//    },
//    {
//        id: 2,
//        title: "The Parley Letter",
//        author: {
//            name: "d2h"
//        },
//        date: new Date("12-27-2012"),
//        excerpt: "Duis lobortis risus non bibendum congue. Maecenas lectus mauris, vehicula at....",
//        body: "Duis lobortis risus non bibendum congue. Maecenas lectus mauris, vehicula at justo et, convallis malesuada leo. Cras pharetra leo vitae nisl vehicula laoreet vitae sit amet dolor. Vestibulum at tellus vel quam suscipit bibendum ac nec urna. Aenean turpis erat, venenatis nec gravida ut, malesuada nec arcu. Vestibulum pretium arcu a bibendum blandit. Vestibulum fermentum orci a scelerisque sagittis. Proin vitae tincidunt ante. Ut egestas felis in orci iaculis bibendum. Aenean pellentesque viverra odio, ac vestibulum augue dictum eget. Nam elementum tincidunt nunc vel pretium. Pellentesque in dui sagittis purus congue mollis. Proin blandit fringilla iaculis. Nam leo nibh, malesuada eu enim in, tempus mollis sem."
//    }
//];