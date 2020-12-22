$(document).ready(function () {

    //On Load Fetch
    fetchAllBlogs();

    $('#five_liked_blogs').click(function () {
        fetchMyRecentFiveLikedBlogs();
    });

    $('#my_comment_blogs').click(function () {
        fetchMyCommentedBlogs();
    });

    $('#my_cmnt_history_on_author_blogs').click(function () {
        fetchMyCommentedBlogsAuthor();
    });

});

function fetchAllBlogs() {
    $.ajax({
        type: 'POST',
        url: '/fetch_all_blogs/',
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                $('#blogs').empty();
                response.blogs.forEach(function (blog) {
                    const authorBlogs = "<div class='card'>" +
                        "<div class='card-body'>" +
                        "<h5 class='card-title'>" + blog.blog_name +
                        "<span style='float: right'>" +
                        "<button class='btn btn-sm btn-info like_or_dislike' id='" + blog.blog_id + "' value='True'>Likes [ <span>" + blog.count_likes + "</span> ]</button>" +
                        "<button class='btn btn-sm btn-danger like_or_dislike' id='" + blog.blog_id + "' value='False'>Dislikes [ <span>" + blog.count_dislikes + "</span> ]</button>" +
                        "</span>" +
                        "</h5>" +
                        "<p>Last Updated:  " + blog.m_time + "  Author: " + blog.author_id__author_name + "</p>" +
                        "<p class='card-text'>" + blog.blog_content + "</p>" +
                        "<span style='display: -webkit-box;' class='comment-inputs'><input class='form-control blog_comment' placeholder='Comment here...'  style='width: 75%;' type='text'><button class='btn btn-sm btn-primary save_blog_comment' id='" + blog.blog_id + "'>Comment</button></span>" +
                        "</div>" +
                        "</div><br>";
                    $('#blogs').append(authorBlogs);
                });

                $('.like_or_dislike').click(function () {
                    const blogId = $(this).attr('id').trim();
                    const value = $(this).attr('value').trim();

                    updateBlogLikeDislike(blogId, value);
                });

                $('.save_blog_comment').click(function () {
                    const id = $(this).attr('id');
                    const comment = $(this).closest('.comment-inputs').find('.blog_comment').val();

                    saveReaderComments(id, comment);
                });

            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAllBlogs function -->', error);
        }
    })
}


function updateBlogLikeDislike(id, value) {
    $.ajax({
        type: 'POST',
        url: '/blog_like_dislike/',
        data: {'id': id, 'value': value},
        success: function (response) {
            if (response.result === 'success') {
                fetchAllBlogs();
            } else if (response.result === 'failed') {
                fetchAllBlogs();
            }
        }, error: function (error) {
            console.log('Error in updateBlogLikeDislike function -->', error);
        }
    })
}


function saveReaderComments(id, comment) {
    $.ajax({
        type: 'POST',
        url: '/save_reader_comments/',
        data: {'id': id, 'comment': comment},
        success: function (response) {
            if (response.result === 'success') {
                $('.blog_comment').val('');
                swal(response.msg);
            } else if (response.result === 'failed') {
                $('.blog_comment').val('');
                swal(response.msg);
            }
        }, error: function (error) {
            console.log("Error in saveReaderComments function -->", error);
        }
    })
}


function fetchMyRecentFiveLikedBlogs() {
    $.ajax({
        type: 'POST',
        url: '/recent_five_liked_blogs/',
        success: function (response) {
            if (response.result === 'success') {
                $('#liked_blogs').empty();
                response.blogs.forEach(function (likedBlog) {
                    const myLikedBlogs = "<li class='list-group-item'><b>Blog Title: " + likedBlog.blog_id__blog_name + "</b></li>";
                    $('#liked_blogs').append(myLikedBlogs);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchMyRecentFiveLikedBlogs function -->', error);
        }
    })
}


function fetchMyCommentedBlogs() {
    $.ajax({
        type: 'POST',
        url: '/my_commented_blogs/',
        success: function (response) {
            if (response.result === 'success') {
                $('#my_commented_blog').empty();
                response.commented_blogs.forEach(function (blog) {
                    const blogs = "<li class='list-group-item'><input class='form-check-input me-1 select_blog' name='select_blog' type='checkbox' id='" + blog.blog_id + "'><b>Blog Title: " + blog.blog_id__blog_name + "</b></li>";
                    $('#my_commented_blog').append(blogs);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }

            $(".select_blog").click(function () {

                var $box = $(this);
                if ($box.is(":checked")) {
                    var group = "input:checkbox[name='" + $box.attr("name") + "']";
                    $(group).prop("checked", false);
                    $box.prop("checked", true);
                    const blogId = $box.attr('id');
                    fetchMyCommentHistroy(blogId);
                } else {
                    $box.prop("checked", false);
                    $(".select_blog").prop("checked", false);
                }
            });

        }, error: function (error) {
            console.log('Error in fetchMyCommentedBlogs function -->', error);
        }
    })
}


function fetchMyCommentHistroy(blogId) {
    $.ajax({
        type: 'POST',
        url: '/my_comment_histroy/',
        data: {'blogId': blogId},
        success: function (response) {
            if (response.result === 'success') {
                $('#comment_histroy').empty();
                $('#count_comments').text(response.comments.length + 'comment');
                response.comments.forEach(function (comment) {
                    const history = "<li class='list-group-item'><b>" + comment.comment_text + "</b></li>";
                    $('#comment_histroy').append(history);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchMyCommentHistroy function -->', error);
        }
    })
}


function fetchMyCommentedBlogsAuthor() {
    $.ajax({
        type: 'POST',
        url: '/my_commented_blog_authors/',
        success: function (response) {
            if (response.result === 'success') {
                $('#commented_blogs_authors').empty();
                response.authorsList.forEach(function (author) {
                    const authors = "<li class='list-group-item'><input class='form-check-input me-1 select_author' name='select_author' type='checkbox' id='" + author.blog_id__author_id + "'><b>Author: " + author.blog_id__author_id__author_name + "</b></li>";
                    $('#commented_blogs_authors').append(authors);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
            $(".select_author").click(function () {
                var $box = $(this);
                if ($box.is(":checked")) {
                    var group = "input:checkbox[name='" + $box.attr("name") + "']";
                    $(group).prop("checked", false);
                    $box.prop("checked", true);
                    const authorId = $box.attr('id');
                    fetchCommentsHistoryForAuhtor(authorId);
                } else {
                    $box.prop("checked", false);
                    $(".select_author").prop("checked", false);
                }
            });

        }, error: function (error) {
            console.log('Error in fetchMyCommentedBlogsAuthor function -->', error);
        }
    })
}


function fetchCommentsHistoryForAuhtor(authorId) {
    $.ajax({
        type: 'POST',
        url: '/fetch_my_comment_history_for_author/',
        data: {'authorId': authorId},
        success: function (response) {
            if (response.result === 'success') {
                $('#auth_blog_comments').empty();
                $('#auth_blog_comments_count').text(response.blog_comments.length + ' comment');
                response.blog_comments.forEach(function (comment) {
                    const history = "<li class='list-group-item'><b>Title: " + comment.blog_id__blog_name + " | Comment:  " + comment.comment_text + "</b></li>";
                    $('#auth_blog_comments').append(history);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchCommentsHistoryForAuhtor function -->', error);
        }
    })
}