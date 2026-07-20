# Cyber security base 2025 – course project 1

Instructions for running the code:

- run python -m pip install django-smart-ratelimit to add the module needed for the fix for flaw 3.

## FLAW 1: Naive Login Cookie

### A01:2021 – Broken Access Control

An extremely naive login implementation relies on setting an unsigned browser cookie with no server-side tracking or verification when a user successfully logs in, and uses the cookie to check access rights. This leaves the system vulnerable for client-side manipulation of access rights by simply modifying the cookie.

![User not logged in](/screenshots/flaw-1-before-1.png)
*User not logged in*

![Logging in with testuser](/screenshots/flaw-1-before-2.png)
*Logging in with testuser*

![Logged in as testuser](/screenshots/flaw-1-before-3.png)
*Logged in as testuser*

![Modifying username cookie to become otheruser](/screenshots/flaw-1-before-4.png)
*Modifying username cookie to become otheruser*

![Dummy delete link shows they're now logged in as otheruser](/screenshots/flaw-1-before-5.png)
*Dummy delete link shows they're now logged in as otheruser*

- Only cookie checked to verify access to posting a new poll
[/polls/views.py#L46](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/views.py#L46)
- Naive cookie set after logging in
[/users/views.py#L32](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/users/views.py#L32)
- Login / logout links showed based on naive cookie
[/polls/templates/polls/index.html#L11](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/index.html#L11)
- Poll list shows a link to create a new poll based on cookie:
[/polls/templates/polls/index.html#L55](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/index.html#L55)

If the authentication and session control need to be implemented manually without using the Django authentication module, the session cookie should be changed to e.g. a token signed with an appropriate cryptographic method, with appropriate expiration included in the token to lessen the impact of any cookie hijacking. However, I opted to use the Django user authentication module, as it is more likely to be robust compared to an individual developer’s own ideas.

![Logging in as djangotest using the Django login](/screenshots/flaw-1-after-1.png)
*Logging in as djangotest using the Django login*

![No client-side login information cookie](/screenshots/flaw-1-after-2.png)
*No client-side login information cookie*

- Using Django's "login required"-decorator for access control
[/polls/views.py#L43](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/views.py#L43)
- Reading the logged in user's username from the Django user object instead of a cookie
[/polls/views.py#L48](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/views.py#L48)
- Login / logout links based on whether we have an authenticated user
[main/polls/templates/polls/index.html#L17](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/index.html#L17)
- Showing the link to the new poll form based on having an authenticated user
[/polls/templates/polls/index.html#L60](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/index.html#L60)

## FLAW 2: Flawed Password Hash

### A02:2021 – Cryptographic Failures

(Note that there are no screenshots, as it's not really possible to take screenshots of a hash function? A link to a massive MD5 lookup table has been provided, instead.)

The password hash for users is stored as an (unsalted) MD5 hash. MD5 is not suited for use as a hash function for passwords, as it both suffers from hash collisions and pre-computed lookup tables already exist for finding the matching password for a MD5 hash for [billions of possible passwords](https://crackstation.net/).

- Using MD5 as the password hash
[/users/models.py#L23](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/users/models.py#L23)

The User model needs to be modified to include the salt value used for the user’s password hashing, and the hashing method needs to be changed to something more secure, such as scrypt or pbkdf2_hmac provided by the Python hashlib module. However, the Django user system already uses pbkdf2_hmac for password hashing, so replacing the self-made naive implementation with the provided Django implementation is perhaps the easiest fix.

- Replacing the naive user model and login with Django's built-in model and login
[/csb2025/urls.py#L21](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/csb2025/urls.py#L21)
[/csb2025/urls.py#L32](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/csb2025/urls.py#L32)
(Note that the definition of the login view also includes the access rate limit from the fix for flaw 3.)
- A basic login form for the built-in model
[/polls/templates/registration/login.html](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/registration/login.html)

## FLAW 3: Weak Login Page

### A07:2021 – Identification and Authentication Failures

The naive login form does not perform any timeout or rate limiting checks, enabling a credential stuffing or brute force attack. This is further exacerbated by the MD5 hash function being fast: Checking a password for a match takes practically no time compared to e.g. using a SHA-256 function 100,000 times in a row, a default for the Django pbkdf2_hmac implementation.

- The login form has no rate limiting implemented
[/users/views.py#L14](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/users/views.py#L14)

Using the [hackpassword.py](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/hackpassword.py) script from the Securing Software course with some modifications to brute force the password takes approximately 5 seconds.

![hackpassword.py finds the password](/screenshots/flaw-3-before-1.png)
*hackpassword.py finds the password*

Unfortunately the default Django authentication implementation does not have any rate limiting options, either. Rate limiting could be performed at the HTTP server, but I am choosing to use an optional Django module called django-smart-ratelimit.

- Added to INSTALLED_APPS after running pip install
[/csb2025/settings.py#L43](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/csb2025/settings.py#L43)
- And added to MIDDLEWARE
[/csb2025/settings.py#L55](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/csb2025/settings.py#L55)
- Demonstrating the rate limiting with the naive login form
[/users/views.py#L4](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/users/views.py#L4)
[/users/views.py#L13](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/users/views.py#L13)

Even with the naive implementation the brute force attack has been made more difficult: The hackpassword.py script trips the rate limiting, requests are denied with HTTP status 429 “Too many requests” and the script fails.

![hackpassword.py fails to find the password, as requests are rejected](/screenshots/flaw-3-after-1.png)
*hackpassword.py fails to find the password, as requests are rejected*

![The server rejects login attempts after the rate limiter is tripped](/screenshots/flaw-3-after-2.png)
*The server rejects login attempts after the rate limiter is tripped*

Applying the rate limiter to the Django authentication module's built-in login view requires using the ratelimit decorator creatively. It requires calling the decorator function first with the arguments defining the rate limiter's parameters, and then calling the function returned by the decorator with the built-in view's as_view() result as the argument.

- Adding the rate limiter to the built-in Django login view
[/csb2025/urls.py#L23](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/csb2025/urls.py#L23)
[/csb2025/urls.py#L33](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/csb2025/urls.py#L33)

## FLAW 4: Injection vulnerability

### A03:2021 – Injection and A05:2021 – Security Misconfiguration

The system is designed to fetch dynamic content from the database to display. Since there was a requirement for the text to be “rich”, it was decided to save the data as HTML and to render it without escaping the HTML tags. However, a mistake was made in the implementation / configuration: The scope for the “autoescape off” block in detail.html contains the actual poll question text and poll choices, leading to an injection vulnerability. Any HTML will be parsed and Javascript will be run.

![View from admin page showing html and Javascript in the poll data](/screenshots/flaw-4-before-1.png)
*View from admin page showing html and Javascript in the poll data*

![YOU ARE HACKED](/screenshots/flaw-4-before-2.png)
*YOU ARE HACKED*

- Automatic escaping of variables turned off
[/polls/templates/polls/detail.html#L12](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/detail.html#L12)
- User-supplied data that is now displayed without filtering or escaping
[/polls/templates/polls/detail.html#L21](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/detail.html#L21)
[/polls/templates/polls/detail.html#L32](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/detail.html#L32)

The clear fix is to make sure that “autoescape off” blocks are used only where absolutely needed, and that their scope is the minimum possible. In this case it is not even necessary to use a full block, it is sufficient to explicitly mark the wall_of_text data using the “|safe” filter.

![The injection no longer works.](/screenshots/flaw-4-after-1.png)
*The injection no longer works.*

- Remove the "autoescape off" and "endautoescape" template tags
([/polls/templates/polls/detail.html#L12](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/detail.html#L12) and [/polls/templates/polls/detail.html#L39](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/detail.html#L39))
- Mark the wall of text as safe
[/polls/templates/polls/detail.html#L15](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/detail.html#L15)

## FLAW 5: CSRF – cross-site request forgery

### No OWASP number, excplicitly allowed by the project description

Django has middleware designed to combat cross-site request in use when using the default configuration. Unless the middleware is manually disabled, all POST requests must include a CSRF token: forgetting or removing the {% csrf_token %} template instruction from your forms will actually result in an error. This works together with the principle that GET requests should not have any side-effects, and do not need protection from cross-site request forgery.

Unfortunately, a developer who is too clever for their own good and who for some reason likes GET requests can accidentally bypass CSRF protection by sending a form over as a GET request.

- Form method = "GET"
[/polls/templates/polls/newpoll_injection.html#L8](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/templates/polls/newpoll_injection.html#L8)
- View for processing the GET method form
[/polls/views.py#L82](https://github.com/aniemela-cloud/csb2025-course-project-1/blob/main/polls/views.py#L82)

![GET form accessed by manually crafting an URL, guaranteeing there's no CSRF token in the "form"](/screenshots/flaw-5-before-1.png)
*GET form accessed by manually crafting an URL, guaranteeing there's no CSRF token in the "form"*

![The bypass worked and the new question is in the database](/screenshots/flaw-5-before-2.png)
*The bypass worked and the new question is in the database*

The fix for this flaw is simple: Do not implement GET requests that have side-effects. The new poll form that is submitted using a POST request implements CSRF protections by default.

![Attempting the GET bypass on the POST method form.](/screenshots/flaw-5-after-1.png)
*Attempting the GET bypass on the POST method form.*

![The attempt only opens the form.](/screenshots/flaw-5-after-2.png)
*The attempt only opens the form.*

![And the HELLO WORLD poll has not been added.](/screenshots/flaw-5-after-3.png)
*And the HELLO WORLD poll has not been added.*
