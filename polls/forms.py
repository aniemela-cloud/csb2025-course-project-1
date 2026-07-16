from django import forms

class QuestionForm(forms.Form):
  username = forms.CharField(widget=forms.HiddenInput())
  question_text = forms.CharField(label="Your question", max_length=200)
  choice_1_text = forms.CharField(label="The first choice", max_length=200)
  choice_2_text = forms.CharField(label="The second choice", max_length=200)
  choice_3_text = forms.CharField(label="The third choice", max_length=200, required=False)
  