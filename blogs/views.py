import re

from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
import datetime
from django.views.decorators.csrf import csrf_exempt
from blogs import models
from blogs.utils import *


def index(request):
    context = {}
    return render(request, 'login.html', context)


def signup(request):
    context = {}
    return render(request, 'signup.html', context)


@csrf_exempt
def login_operation(request):
    try:
        useremail = request.POST.get('useremail')
        password = request.POST.get('password')
        u_name = re.search(r'\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', useremail, re.I)
        if u_name:
            try:
                validate_user = models.AuthUsers.objects.get(useremail=useremail,
                                                             password=encrypt_password(password),
                                                             status__iexact='active')
                if validate_user is not None:
                    request.session['usercode'] = validate_user.user_code
                    response_msg = {"result": "success", 'u_type': validate_user.role_id.role_code,
                                    'u_code': validate_user.user_code}
                    print(response_msg)
                else:
                    response_msg = {"result": "failed", "msg": "Invalid User credentials"}
            except models.AuthUsers.DoesNotExist:
                response_msg = {"result": "failed", "msg": "Invalid User credentials"}
            return JsonResponse(response_msg)
        else:
            return JsonResponse({"result": "Invalid", "msg": "Invalid Username."})


    except Exception as e:
        print("Exception in login_operation views.py-->", e)
        return JsonResponse({"result": "error", "msg": "Opps!, Server error while login"})


def logout(request):
    try:
        # Remove the authenticated user's ID from the request and flush their session data.Add details to UserLogs table.
        if 'usercode' in request.session:
            user_code = request.session['usercode']
            print('LOGOUT - ---- > ', user_code)
            request.session.flush()
        return HttpResponseRedirect('/')
    except Exception as e:
        print('Exception in logout --> ', e)
        request.session.flush()
        return HttpResponseRedirect('/')


def author_dashboard(request):
    if 'usercode' in request.session:
        user_code = request.session['usercode']
        user_details = list(
            models.AuthUsers.objects.filter(user_code=user_code).values('username', 'useremail'))
        return render(request, 'author_dashboard.html',
                      {'user_code': user_code, 'details': user_details, 'type': 'AUTHOR'})


def reader_dashboard(request):
    if 'usercode' in request.session:
        user_code = request.session['usercode']
        user_details = list(
            models.AuthUsers.objects.filter(user_code=user_code).values('username', 'useremail'))
        return render(request, 'reader_dashboard.html',
                      {'user_code': user_code, 'details': user_details, 'type': 'READER'})


@csrf_exempt
def register(request):
    try:
        if request.method == 'POST':

            type = request.POST['type']
            name = request.POST['name']
            email = request.POST['email']
            password = request.POST['password']

            check_email_exist = models.AuthUsers.objects.filter(useremail=email).exists()
            print(check_email_exist)
            if check_email_exist is False:
                unique_code = getUniqueUserCode()
                if type == 'Author':
                    create_author = models.BlogAuthor.objects.create(author_name=name, author_usercode=unique_code,
                                                                     author_email=email)
                    if create_author is not None:
                        try:
                            models.AuthUsers.objects.create(user_code=unique_code, useremail=email,
                                                            username=name,
                                                            password=encrypt_password(password),
                                                            role_id=models.Role.objects.get(role_code='AUTHOR')
                                                            )
                            return JsonResponse({'result': 'success', 'msg': 'Registration successfull'})
                        except Exception as e:
                            print('Exception in author creation ->', e)
                            models.BlogAuthor.objects.filter(author_usercode=unique_code).delete()
                            return JsonResponse(
                                {"result": "failed", "msg": "Unable to register at this moment! Try again"})

                elif type == 'Reader':
                    create_reader = models.BlogReader.objects.create(reader_name=name, reader_usercode=unique_code,
                                                                     reader_email=email)
                    if create_reader is not None:
                        try:
                            models.AuthUsers.objects.create(user_code=unique_code, useremail=email,
                                                            username=name,
                                                            password=encrypt_password(password),
                                                            role_id=models.Role.objects.get(role_code='READER')
                                                            )
                            return JsonResponse({'result': 'success', 'msg': 'Registration successfull'})
                        except Exception as e:
                            print('Exception in author creation ->', e)
                            models.BlogReader.objects.filter(reader_usercode=unique_code).delete()
                            return JsonResponse(
                                {"result": "failed", "msg": "Unable to register at this moment! Try again"})
            elif check_email_exist is True:
                return JsonResponse(
                    {"result": "email_exist", "msg": "We already have an account with this email id! Try another"})
    except Exception as e:
        print("Exception in register views.py-->", e)
        return JsonResponse({"result": "failed", "msg": "Unable to register at this moment! Try again"})


@csrf_exempt
def save_blog(request):
    try:
        if 'usercode' in request.session:
            user_code = request.session['usercode']

            if request.method == 'POST':
                blogId = request.POST['blogId']
                blogTitle = request.POST['blogTitle']
                blogContent = request.POST['blogContent']

                now = datetime.datetime.now()
                if blogId == '':
                    models.Blog.objects.create(blog_name=blogTitle, blog_content=blogContent,
                                               m_time=now.strftime("%Y-%m-%d"),
                                               author_id=models.BlogAuthor.objects.get(author_usercode=user_code))

                    return JsonResponse({'result': 'created', 'msg': 'New blog added successfully'})

                elif blogId != '':
                    models.Blog.objects.filter(blog_id=blogId).update(blog_name=blogTitle, blog_content=blogContent,
                                                                      author_id=models.BlogAuthor.objects.get(
                                                                          author_usercode=user_code),
                                                                      m_time=now.strftime("%Y-%m-%d"),
                                                                      modified_time=now
                                                                      )

                    return JsonResponse({'result': 'updated', 'msg': 'Blog updated successfully'})
        else:
            return JsonResponse({'result': 'failed', 'msg': 'Failed! Try again'})
    except Exception as e:
        print('Exception in save_blog views.py -->', e)
        return JsonResponse({'result': 'failed', 'msg': 'Failed! Try again'})


@csrf_exempt
def author_blogs(request):
    try:
        if 'usercode' in request.session:
            user_code = request.session['usercode']

            if request.method == 'POST':
                author = models.BlogAuthor.objects.get(author_usercode=user_code)
                author_blogs = list(
                    models.Blog.objects.filter(author_id=author.author_id).values('blog_id', 'blog_name', 'm_time',
                                                                                  'blog_content'))
                return JsonResponse({'result': 'success', 'author_blogs': author_blogs})
    except Exception as e:
        print('Exception in save_blog views.py -->', e)
        return JsonResponse({'result': 'failed', 'msg': 'Failed to load blogs! Refresh the page'})


@csrf_exempt
def fetch_all_blogs(request):
    try:
        if 'usercode' in request.session:
            if request.method == 'POST':
                blogs = list(models.Blog.objects.all().values('blog_id', 'blog_name', 'm_time','author_id__author_name',
                                                              'blog_content'))

                return JsonResponse({'result': 'success', 'blogs': blogs})
    except Exception as e:
        print('Exception in fetch_all_blogs views.py -->', e)
        return JsonResponse({'result': 'failed', 'msg': 'Failed to load blogs! Refresh the page'})
