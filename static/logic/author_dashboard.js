$(document).ready(function () {
    fetchMyAddedBlogs();
    $('#save_blog').click(function () {
        createNewBlog();
    });

    $('#top_five_cmnt_blogs').click(function () {
        fetchTopFiveCommentedBlogs();
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
                        "<p>Last Updated:  " + blog.m_time + "</p>" +
                        "<p class='card-text'>" + blog.blog_content + "</p>" +
                        "</div>" +
                        "</div><br>";

                    $('#my_blogs').append(blogs);
                })
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchMyAddedBlogs function -->', error);
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
                    const blogs = "<li class='list-group-item'><b>Blog Title: " + blog.blog_name + "</b></li>";
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

}