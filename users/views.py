from django.http import HttpResponseRedirect
from django.shortcuts import render
# XXX FLAW 3 FIX demonstration for even the naive login form
# from django_smart_ratelimit import ratelimit
from .forms import LoginForm
from .models import User

import logging

logger = logging.getLogger(__name__)

# XXX FLAW 3 fix demonstration for even the naive login form
# @ratelimit(key='ip', rate='10/m', block=True)
def loginForm(request):
  # if this is a POST request we need to process the form data
  formerror = False
  if request.method == "POST":
    # create a form instance and populate it with data from the request:
    form = LoginForm(request.POST)
    # check whether it's valid:
    if form.is_valid():
      # Check if user exists
      try:
        user = User.objects.get(username__iexact=form.cleaned_data["username"])
        if user.check_password(form.cleaned_data["password"]):
          # Set user logged in token
          # redirect to a new URL:
          response = HttpResponseRedirect("/polls/")
          # XXX Using a simple cookie to store the username as a form of
          # session/login tracking is insufficient. It can easily be modified
          # by the client. 
          response.set_cookie("username",form.cleaned_data["username"])
          return response
      except User.DoesNotExist:
        formerror = "Invalid username or password."
  # if a GET (or any other method) we'll create a blank form
  else:
    form = LoginForm()

  return render(request, "users/login.html", {"form": form, "loginerror":formerror})

def logoutView(request):
  response = HttpResponseRedirect("/polls/")
  # XXX After the user session/login cookie is replaced with a better one,
  # this needs to be updated to clear it.
  response.delete_cookie("username")
  return response
