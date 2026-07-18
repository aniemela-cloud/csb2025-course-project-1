# csb2025-course-project-1

Repository for the University of Helsinki Cyber Security Base 2025 Course Project 1

## TODO

### Security issues and issue demonstrations to add

#### Identification and Authentication Failures

The naive login form not limiting bruteforce attacks could be demonstrated to be a
problem using the password hacker from the Securing Software exercise number ??

We then need to show that it isn't so problematic with the Django login page?

Initial tests indicate a 4* time to test passwords on Django login page vs naive page

#### Security Misconfiguration

I am not quite sure how to include this. Removing the csrf token might help, that
could be combined with the forms so that we can just spam logins without making
a session? I'm not quite sure... This might need more time in the oven

This is technically also "doable" with the explicit autoescape off in a template mentioned
below.

And perhaps the fact that the default Django authentication does not perform any actual rate limiting.
Perhaps worth mentioning that either the http server used to host the Django site or a proxy or something
needs to have rate limiting configured.

#### Injection

1. [X] Make a version of the "post poll" form that does not use the Django Form class
2. [X] Test to see if you can inject HTML using it
   - I can't.
3. If you can, take a screenshot...

It looks like Django's templates autoescape data pulled from the database? UGHHHH. This means I have
to either programmatically create the output or explicitly disable autoescape from a template.

#### Maybe Security Logging and Monitoring Failures?

Need to check where you set up Django's logging. This could be a good one? IDK.

Does not seem easy to figure out and explain.
