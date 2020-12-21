$(document).ready(function () {

    //On Load Fetch
    fetchAllBlogs();
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
                        "<h5 class='card-title'>" + blog.blog_name + "</h5><p>Last Updated:  " + blog.m_time + "  Author: " + blog.author_id__author_name + "</p>" +
                        "<p class='card-text'>" + blog.blog_content + "</p>" +
                        "<span><i class='fa fa-thumbs-up'><input type='radio' class='likeDislike'  name='gender' value='False' hidden></i>" + ' ' + " <i class='fa fa-thumbs-down' class='likeDislike' style='margin-left: 20px'><input type='radio' name='gender' value='True' hidden></i></span>" +
                        "</div>" +
                        "</div><br>";
                    $('#blogs').append(authorBlogs);
                });

                $('.likeDislike').click(function () {
                    const choice = $("input[name='gender']:checked").val();
                    console.log('choice-->', choice);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAllBlogs function -->', error);
        }
    })
}


