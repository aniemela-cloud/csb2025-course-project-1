from django.db.models import F
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from django.utils import timezone
# XXX A01/A02/A07 fix: decorator for requiring login for new poll
#from django.contrib.auth.decorators import login_required
from .models import Choice, Question
from .forms import QuestionForm
import logging

logger = logging.getLogger(__name__)

class IndexView(generic.ListView):
  template_name = "polls/index.html"
  context_object_name = "latest_question_list"
  def get_queryset(self):
    """Return the last five published questions."""
    return Question.objects.filter(pub_date__lte=timezone.now()).order_by("-pub_date")[:5]

class DetailView(generic.DetailView):
  model = Question
  template_name = "polls/detail.html"

class ResultsView(generic.DetailView):
  model = Question
  template_name = "polls/results.html"
# XXX A01/A02/A07 fix: Uses Django auth to ensure the user is
# authenticated for creating new polls
#@login_required(login_url="/accounts/login/")
def newPollForm(request):
  # XXX A01: Using an unencrypted cookie for user access control
  username = request.COOKIES.get('username',0)
  # XXX A01/A02/A07 fix: 
  # username = request.user.username

  if not username:
    # Unnecessary if the login_required decorator is in use
    return HttpResponseRedirect("/polls/")
  
  if request.method == "POST":
    # create a form instance and populate it with data from the request:
    form = QuestionForm(request.POST)
    # check whether it's valid:
    if form.is_valid():
      # redirect to a new URL:
      newpoll = Question(
        question_text = form.cleaned_data["question_text"],
        pub_date = timezone.now(),
        username = username # Either from the cookie (bad) or the Django user object (good)
      )
      newpoll.save()
      newpoll.choice_set.create(choice_text=form.cleaned_data["choice_1_text"], votes=0)
      newpoll.choice_set.create(choice_text=form.cleaned_data["choice_2_text"], votes=0)
      if form.cleaned_data["choice_3_text"]:
        newpoll.choice_set.create(choice_text=form.cleaned_data["choice_3_text"], votes=0)
      newpoll.save()
      return HttpResponseRedirect("/")

  # if a GET (or any other method) we'll create a blank form
  else:
    form = QuestionForm()

  return render(request, "polls/newpoll.html", {"form": form})

# XXX newPollInjectable breaks the rule of "GET requests must not have any side-effects".
# Letting a GET request create a poll in the system means that it bypasses CSRF protection
# This view is not modified to use the Django authentication system, and is left as-is.
def newPollInjectable(request):
  username = request.COOKIES.get('username',0)
  if not username:
    logger.debug('newPollInjectable: no username')
    return HttpResponseRedirect("/polls/")
  try:
    question_text = request.GET.get("question_text")
    choice_1_text = request.GET.get("choice_1_text")
    choice_2_text = request.GET.get("choice_2_text")
  except KeyError:
    # XXX We also lose the provided GET parameters, but that is
    # not important for highlighting the security vulnerability.
    logger.debug('newPollInjectable: request.GET KeyError')
    return render(request, "polls/newpoll_injection.html")
  choice_3_text = request.GET.get("choice_3_text", None)
  if question_text:
    newpoll = Question(
      question_text = question_text,
      pub_date = timezone.now(),
      username = username)
    newpoll.save()
    if choice_1_text:
      newpoll.choice_set.create(choice_text=choice_1_text)
    if choice_2_text:
      newpoll.choice_set.create(choice_text=choice_2_text)
    if choice_3_text:
      newpoll.choice_set.create(choice_text=choice_3_text)
    newpoll.save()
    return HttpResponseRedirect("/")
  else:
    return render(request, "polls/newpoll_injection.html")
  

def vote(request, question_id):
  question = get_object_or_404(Question, pk=question_id)
  try:
    selected_choice = question.choice_set.get(pk=request.POST["choice"])
  except (KeyError, Choice.DoesNotExist):
    # Redisplay the question voting form.
    return render(
        request,
        "polls/detail.html",
        {
            "question": question,
            "error_message": "You didn't select a choice.",
        },
    )
  else:
    selected_choice.votes = F("votes") + 1
    selected_choice.save()
    # Always return an HttpResponseRedirect after successfully dealing
    # with POST data. This prevents data from being posted twice if a
    # user hits the Back button.
    return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))

