"""
URL configuration for csb2025 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path, include
from django.views.generic import RedirectView
# XXX Fix for A01:2021 / A02:2021 / A07:2021
# from django.contrib.auth import views as auth_views
# XXX FLAW 3 fix for limiting the Django login
# from django_smart_ratelimit import ratelimit

urlpatterns = [
    path('', RedirectView.as_view(url='polls/', permanent=True)),
    path('admin/', admin.site.urls),
    path('polls/', include('polls.urls')),
    # XXX Naive user login and user model
    path('users/', include('users.urls')),
    # XXX Fix for A01:2021 / A02:2021 / A07:2021
    # path("accounts/login/", 
    #     ratelimit(key='ip', rate='10/m', block=True)(auth_views.LoginView.as_view(next_page='/polls/')), 
    #     name='login'),
    # path("accounts/logout/", auth_views.LogoutView.as_view(next_page='/polls/'), name='logout')
]
