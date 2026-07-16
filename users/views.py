from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import LoginForm


# Create your views here.
def loginForm(request):
  # if this is a POST request we need to process the form data
  if request.method == "POST":
    # create a form instance and populate it with data from the request:
    form = LoginForm(request.POST)

    # check whether it's valid:
    if form.is_valid():
      # redirect to a new URL:
      return HttpResponseRedirect("/")

  # if a GET (or any other method) we'll create a blank form
  else:
    form = LoginForm()

  return render(request, "users/login.html", {"form": form})
