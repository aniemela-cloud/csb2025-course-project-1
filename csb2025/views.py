# XXX FLAW 3 FIX: This whole views.py file exists to decorate the default Django login view
# with the smart ratelimit limiter
from django.contrib.auth.views import LoginView
from django_smart_ratelimit import ratelimit

@ratelimit(key='ip', rate='10/m', block=True)
class LimitedLoginView(LoginView):
  nex_page='/polls/'