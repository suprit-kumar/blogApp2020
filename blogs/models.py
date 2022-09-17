from django.db import models


# Create your models here.
class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=100, null=True, default="")
    role_code = models.CharField(max_length=50, null=True, default="")
    role_status = models.CharField(max_length=50, null=True, default="")
    created_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "role"

    def __unicode__(self):
        return f'{[self.role_id]}'


class BlogReader(models.Model):
    reader_id = models.AutoField(primary_key=True)
    reader_name = models.CharField(max_length=100, null=True, default="")
    reader_usercode = models.CharField(max_length=100, null=True, default="")
    reader_email = models.CharField(max_length=100, null=True, default="")
    created_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "reader"

    def __unicode__(self):
        return f'{[self.reader_id]}'


class BlogAuthor(models.Model):
    author_id = models.AutoField(primary_key=True)
    author_name = models.CharField(max_length=100, null=True, default="")
    author_usercode = models.CharField(max_length=100, null=True, default="")
    author_email = models.CharField(max_length=100, null=True, default="")
    created_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "author"

    def __unicode__(self):
        return f'{[self.author_id]}'


class Blog(models.Model):
    blog_id = models.AutoField(primary_key=True)
    blog_name = models.CharField(max_length=100, null=True, default="")
    blog_content = models.TextField(max_length=2500, null=True, default="")
    author_id = models.ForeignKey(BlogAuthor, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True, null=True)
    modified_time = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    m_time = models.CharField(max_length=100, null=True, default="")
    count_likes = models.IntegerField(default=0)
    count_dislikes = models.IntegerField(default=0)
    count_comments = models.IntegerField(default=0)

    class Meta:
        db_table = "blog"

    def __unicode__(self):
        return f'{[self.blog_id]}'


class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    blog_id = models.ForeignKey(Blog, on_delete=models.CASCADE)
    reader_id = models.ForeignKey(BlogReader, on_delete=models.CASCADE)
    comment_text = models.TextField(max_length=2500, null=True, default="")
    created_time = models.DateTimeField(auto_now_add=True, blank=True)
    modified_time = models.DateTimeField(auto_now_add=False, null=True, blank=True,)
    m_time = models.CharField(max_length=100, null=True, default="")

    class Meta:
        db_table = "comment"

    def __unicode__(self):
        return f'{[self.comment_id]}'


class Response(models.Model):
    response_id = models.AutoField(primary_key=True)
    blog_id = models.ForeignKey(Blog, on_delete=models.CASCADE)
    reader_id = models.ForeignKey(BlogReader, on_delete=models.CASCADE)
    like_or_not = models.BooleanField()
    response_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "response"

    def __unicode__(self):
        return f'{[self.response_id]}'


class AuthUsers(models.Model):
    u_id = models.AutoField(primary_key=True)
    user_code = models.CharField(max_length=250, null=True, default="")
    username = models.CharField(max_length=250, null=True, default="")
    useremail = models.CharField(max_length=250, null=True, default="")
    password = models.CharField(max_length=250, null=True, default="")
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, null=True, default="active")
    user_created_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "authenticated_users"

    def __unicode__(self):
        return f'{[self.u_id]}'
