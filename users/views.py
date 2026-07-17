from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import LoginForm
from .models import User

import logging

logger = logging.getLogger(__name__)

# Create your views here.
def loginForm(request):
  # if this is a POST request we need to process the form data
  formerror = False
  logger.debug("Processing loginForm")
  if request.method == "POST":
    # create a form instance and populate it with data from the request:
    logger.debug("> POST handling")
    form = LoginForm(request.POST)
    # check whether it's valid:
    if form.is_valid():
      logger.debug(">> Form is valid, username=%s" % form.cleaned_data["username"])
      # Check if user exists
      try:
        user = User.objects.get(username__iexact=form.cleaned_data["username"])
        logger.debug(">> User found")
        if user.check_password(form.cleaned_data["password"]):
          # Set user logged in token
          # redirect to a new URL:
          logger.debug(">>> Password check passed")
          response = HttpResponseRedirect("/polls/")
          response.set_cookie("username",form.cleaned_data["username"])
          return response
      except User.DoesNotExist:
        formerror = "Invalid username or password."
  # if a GET (or any other method) we'll create a blank form
  else:
    form = LoginForm()

  return render(request, "users/login.html", {"form": form, "error":formerror})

def logoutView(request):
  response = HttpResponseRedirect("/polls/")
  response.delete_cookie("username")
  return response
