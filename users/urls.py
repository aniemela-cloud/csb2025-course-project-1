from django.urls import path

from . import views

app_name = "users"
urlpatterns = [
    path('login/', views.loginForm, name='login'),
    # path('logout/', views.loginForm, name='logout')
]