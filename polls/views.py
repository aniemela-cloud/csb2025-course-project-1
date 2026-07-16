from django.db.models import F
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from django.utils import timezone
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

def newPollForm(request):
  # if this is a POST request we need to process the form data
  logger.debug('in newPollForm')
  if request.method == "POST":
    # create a form instance and populate it with data from the request:
    form = QuestionForm(request.POST)
    logger.debug('POST form: username=%s' % form.fields["username"])
    # check whether it's valid:
    if form.is_valid():
      # redirect to a new URL:
      return HttpResponseRedirect("/")

  # if a GET (or any other method) we'll create a blank form
  else:
    form = QuestionForm(initial={"username":"user"})

  return render(request, "polls/newpoll.html", {"form": form})

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

