"""BlogPostProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from blogs import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('signup/', views.signup, name='signup'),
    path('login_operation/', views.login_operation, name='login_operation'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('author_dashboard/', views.author_dashboard, name='author_dashboard'),
    path('reader_dashboard/', views.reader_dashboard, name='reader_dashboard'),
    path('save_blog/', views.save_blog, name='save_blog'),
    path('fetch_author_blogs/', views.author_blogs, name='fetch_author_blogs'),
    path('fetch_all_blogs/', views.fetch_all_blogs, name='fetch_all_blogs'),
    path('fetch_blog_details_for_edit/', views.fetch_blog_details_for_edit, name='fetch_blog_details_for_edit'),
    path('blog_like_dislike/', views.update_blog_like_dislike, name='blog_like_dislike'),
    path('save_reader_comments/', views.save_reader_comments, name='save_reader_comments'),
    path('recent_five_liked_blogs/', views.recent_five_liked_blogs, name='recent_five_liked_blogs'),
    path('my_commented_blogs/', views.my_commented_blogs, name='my_commented_blogs'),
    path('my_comment_histroy/', views.my_comment_histroy, name='my_comment_histroy'),
    path('my_commented_blog_authors/', views.my_commented_blog_authors, name='my_commented_blog_authors'),
    path('fetch_my_comment_history_for_author/', views.fetch_my_comment_history_for_author,
         name='fetch_my_comment_history_for_author'),
    path('fetch_top_five_commented_blogs/', views.fetch_top_five_commented_blogs,
         name='fetch_top_five_commented_blogs'),
    path('fetch_top_five_like_disliked_blogs/', views.fetch_top_five_like_disliked_blogs,
         name='fetch_top_five_like_disliked_blogs'),
    path('fetch_reader_commented_blogs/', views.fetch_reader_commented_blogs,
         name='fetch_reader_commented_blogs'),
]
