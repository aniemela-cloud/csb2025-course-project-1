from django.db import models

class User(models.Model):
  username = models.CharField(max_length=64)
  password = models.CharField(max_length=128)
  name = models.CharField(max_length=256)
  def __str__(self):
    return "%s (%s)" % self.username % self.name
