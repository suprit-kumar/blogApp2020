$(document).ready(function () {
    fetchMyAddedBlogs();
    $('#save_blog').click(function () {
        createNewBlog();
    });

    $('#top_five_cmnt_blogs').click(function () {
        fetchTopFiveCommentedBlogs();
    });

    $('#top_five_like_dislike_blog').click(function () {
        topFiveLikedDislikedBlogs();
    });

    $('#reader_cmnt_blogs').click(function () {
        fetchReaderCommentedBlogs();
    });

});


function createNewBlog() {
    const blogId = $('#hidden_blog_id').val();
    const blogTitle = $('#blog_title').val();
    const blogContent = $('#blog_content').val();

    if (!blogTitle) {
        swal('Enter Blog Title');
        return false;
    } else if (!blogContent) {
        swal('Enter Blog Content');
        return false;
    } else {
        const details = {'blogId': blogId, 'blogTitle': blogTitle, 'blogContent': blogContent};
        $.ajax({
            type: 'POST',
            url: '/save_blog/',
            data: details,
            success: function (response) {
                if (response.result === 'created') {
                    resetInputFields();
                    fetchMyAddedBlogs();
                    swal(response.msg)
                } else if (response.result === 'updated') {
                    resetInputFields();
                    fetchMyAddedBlogs();
                    swal(response.msg)
                } else if (response.result === 'failed') {
                    resetInputFields();
                    fetchMyAddedBlogs();
                    swal(response.msg)
                }
            }, error: function (error) {
                console.log("Error in createNewBlog function -->", error);
            }
        })
    }
}


function fetchMyAddedBlogs() {
    $.ajax({
        type: 'POST',
        url: '/fetch_author_blogs/',
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                $('#my_blogs').empty();
                response.author_blogs.forEach(function (blog) {
                    const blogs = "<div class='card'>" +
                        "<div class='card-body'>" +
                        "<h5 class='card-title'>" + blog.blog_name + "<span style='float: right;font-size: 17px'><a href='javascript:void(0)'><i class='fa fa-thumbs-up' aria-hidden='true'></i> " + blog.count_likes + "</a>" + '  ' + "<a href='javascript:void(0)'><i class='fa fa-thumbs-down' aria-hidden='true'></i>: " + blog.count_dislikes + "</a>" + '  ' + "<a href='javascript:void(0)'><i class='fa fa-comments' aria-hidden='true'></i> " + blog.count_comments + "</a></span></h5>" +
                        "<p>Last Updated:  " + blog.m_time + "<span style='float:right;'><button class='btn btn-sm btn-primary edit-blog' id='" + blog.blog_id + "'>Edit Blog</button></span></p>" +
                        "<p class='card-text'>" + blog.blog_content + "</p>" +
                        "</div>" +
                        "</div><br>";
                    $('#my_blogs').append(blogs);
                })
            } else if (response.result === 'failed') {
                swal(response.msg);
            }

            $('.edit-blog').click(function () {
                const blogId = $(this).attr('id');
                fetchBlogDetailsForEdit(blogId);
            });
        }, error: function (error) {
            console.log('Error in fetchMyAddedBlogs function -->', error);
        }
    })
}

function fetchBlogDetailsForEdit(blogId) {
    $.ajax({
        type: 'POST',
        url: '/fetch_blog_details_for_edit/',
        data: {'blogId': blogId},
        success: function (response) {
            if (response.result === 'success') {
                const blog = response.blogDetails;
                $('#hidden_blog_id').val(blog[0].blog_id);
                $('#blog_title').val(blog[0].blog_name);
                $('#blog_content').val(blog[0].blog_content);
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchBlogDetailsForEdit function -->', error);
        }
    })
}


function resetInputFields() {
    $('#hidden_blog_id,#blog_title,#blog_content').val('');
}


function fetchTopFiveCommentedBlogs() {
    $.ajax({
        type: 'POST',
        url: '/fetch_top_five_commented_blogs/',
        success: function (response) {
            if (response.result === 'success') {
                $('#cmnt_blogs').empty();
                response.topFiveCommentedBlogs.forEach(function (blog) {
                    const blogs = "<li class='list-group-item'><b><span style='color: orangered'>Blog Title: </span>" + blog.blog_name + "</b></li>";
                    $('#cmnt_blogs').append(blogs);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchTopFiveCommentedBlogs function -->', error);
        }
    })
}


function topFiveLikedDislikedBlogs() {
    $.ajax({
        type: 'POST',
        url: '/fetch_top_five_like_disliked_blogs/',
        success: function (response) {
            if (response.result === 'success') {
                $('#like_blogs,#dislike_blogs').empty();
                response.topFivelikedBlogs.forEach(function (liked) {
                    const likedBlogs = "<li class='list-group-item'><b><span style='color: orangered'>Blog Title: </span>" + liked.blog_name + "</b></li>";
                    $('#like_blogs').append(likedBlogs);
                });
                response.topFiveDislikedBlogs.forEach(function (disliked) {
                    const dislikedBlogs = "<li class='list-group-item'><b><span style='color: orangered'>Blog Title: </span>" + disliked.blog_name + "</b></li>";
                    $('#dislike_blogs').append(dislikedBlogs);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchTopFiveCommentedBlogs function -->', error);
        }
    })
}


function fetchReaderCommentedBlogs() {
    $.ajax({
        type: 'POST',
        url: '/fetch_reader_commented_blogs/',
        success: function (response) {
            if (response.result === 'success') {
                $('#commented_blogs').empty();
                response.commentBlogs.forEach(function (blog) {
                    const commentedBlogs = "<li class='list-group-item'><b><span style='color: orangered'>Blog Title: </span>" + blog.blog_id__blog_name + " | <span style='color: orangered'>Comment: </span>" + blog.comment_text + "</b></li>";
                    $('#commented_blogs').append(commentedBlogs);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchReaderCommentedBlogs function -->', error);
        }
    })
}