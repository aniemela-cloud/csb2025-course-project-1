# Cyber security base 2025 – course project 1

Instructions for running the code:

- run python -m pip install django-smart-ratelimit to add the module needed for the fix for flaw 3.

## FLAW 1: Naive Login Cookie

### A01:2021 – Broken Access Control

An extremely naive login implementation relies on setting an unsigned browser cookie with no server-side tracking or verification when a user successfully logs in, and uses the cookie to check access rights. This leaves the system vulnerable for client-side manipulation of access rights by simply modifying the cookie.

- Only cookie checked to verify access to posting a new poll
[https://github.com/aniemela-cloud/csb2025-course-project-1/blob/a5d1a19ca55e6c885fd7d985c5a1252f2cedd2c3/polls/views.py#L46]
- Naive cookie set after logging in
[https://github.com/aniemela-cloud/csb2025-course-project-1/blob/a5d1a19ca55e6c885fd7d985c5a1252f2cedd2c3/users/views.py#L31]
- Poll list shows a link to create a new poll based on cookie:
https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/index.html#L47

// polls/views.py:newPollForm
// users/views.py:loginForm
And
// polls/templates/index.html

If the authentication and session control need to be implemented manually without using the Django authentication module, the session cookie should be changed to e.g. a token signed with an appropriate cryptographic method, with appropriate expiration included in the token to lessen the impact of any cookie hijacking. However, I opted to use the Django user authentication module, as it is more likely to be robust compared to an individual developer’s own ideas.
Using the user object for checking the currently authenticated user:
// polls/views.py:newPollForm
// polls/templates/index.html

## FLAW 2: Flawed Password Hash

### A02:2021 – Cryptographic Failures

The password hash for users is stored as an (unsalted) MD5 hash. MD5 is not suited for use as a cryptographic hash function.
// users/models.py:User

The User model needs to be modified to include the salt value used for the user’s password hashing, and the hashing method needs to be changed to something more secure, such as scrypt or pbkdf2_hmac provided by the Python hashlib module. However, the Django user system already uses pbkdf2_hmac for password hashing, so replacing the self-made naive implementation with the provided Django implementation is perhaps the easiest fix.

// urls.py: imports and path changes in urlpatterns
// adding polls/templates/registration/login.html

## FLAW 3: Weak Login Page

### A07:2021 – Identification and Authentication Failures

The naive login form does not perform any timeout or rate limiting checks, enabling a credential stuffing or brute force attack. This is further exacerbated by the MD5 hash function being fast: Checking a password for a match takes practically no time compared to e.g. using a SHA-256 function 100,000 times in a row, a default for the Django pbkdf2_hmac implementation.
// users/views.py:loginForm

Using the hackpassword.py script with some modifications to brute force the password takes approximately 4 seconds.

Unfortunately the default Django authentication implementation does not have any rate limiting options, either. Rate limiting could be performed at the HTTP server, but I am choosing to use an optional Django module called django-smart-ratelimit.
// settings.py: INSTALLED_APPS
// settings.py: MIDDLEWARE

Even with the naive implementation the brute force attack has been made more difficult: The hackpassword.py script trips the rate limiting, requests are denied with HTTP status 429 “Too many requests” and the script fails.

The fix can be applied to the Django authentication module’s login view by calling the django-smart-ratelimit decorator and then passing the Django login view to the returned function as an argument.

## FLAW 4: Injection vulnerability

### A03:2021 – Injection and A05:2021 – Security Misconfiguration

The system is designed to fetch dynamic content from the database to display. Since there was a requirement for the text to be “rich”, it was decided to save the data as HTML and to render it without escaping the HTML tags. However, a mistake was made in the implementation / configuration: The scope for the “autoescape off” block in detail.html contains the actual poll question text and poll choices, leading to an injection vulnerability. Any HTML will be parsed and Javascript will be run.
// polls/templates/polls/detail.html
The clear fix is to make sure that “autoescape off” blocks are used only where absolutely needed, and that their scope is the minimum possible. In this case it is not even necessary to use a full block, it is sufficient to explicitly mark the wall_of_text data using the “|safe” filter.

## FLAW 5: CSRF – cross-site request forgery

### No OWASP number, excplicitly allowed by the project description

Django has middleware designed to combat cross-site request in use when using the default configuration. Unless the middleware is manually disabled, all POST requests must include a CSRF token: forgetting or removing the {% csrf_token %} template instruction from your forms will actually result in an error. This works together with the principle that GET requests should not have any side-effects, and do not need protection from cross-site request forgery.

Unfortunately, a developer who is too clever for their own good and who for some reason likes GET requests can accidentally bypass CSRF protection by sending a form over as a GET request.

// polls/templates/polls/newpoll_injection.html
// polls/views.py#the injection one

The fix for this flaw is simple: Do not implement GET requests that have side-effects. The new poll form that is submitted using a POST request implements CSRF protections by default.
