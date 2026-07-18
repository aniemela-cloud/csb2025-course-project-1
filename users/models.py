from django.db import models
import hashlib

# XXX An insufficient model for site user data. Should include salt and
# the length of the password field should be checked against whatever 
# password hashing method is chosen to replace MD5
class User(models.Model):
  username = models.CharField(max_length=64, unique=True)
  password = models.CharField(max_length=128)
  name = models.CharField(max_length=256)
  email = models.CharField(max_length=256)
  def __str__(self):
    return "%s (%s)" % (self.username, self.email)
  
  def check_password(self, pw):
    return self.get_hashed_string(pw) == self.password
  
  def set_password(self, pw):
    self.password = self.get_hashed_string(pw)
  
  # XXX MD5 is a cryptographically inadequate method for hashing
  # password strings. It should be replaced.
  def get_hashed_string(self, pw):
    m = hashlib.md5()
    m.update(pw.encode(encoding="UTF-8", errors="strict"))
    return m.hexdigest()    
    
