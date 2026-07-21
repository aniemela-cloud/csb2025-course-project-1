# csb2025-course-project-1

Repository for the University of Helsinki Cyber Security Base 2025 Course Project 1

## Project Report

The project report is [PROJECT.md](PROJECT.md)

## How to run the project

The project is a relatively standard Django project, but I have provided a JSON fixture file containing initial data for easier testing of the project.

    $ git clone https://github.com/aniemela-cloud/csb2025-course-project-1.git
    Cloning into 'csb2025-course-project-1'...
    
    $ cd csb2025-course-project-1/
    
    $ python3 -m venv .venv --system-site-packages
    
    $ source .venv/bin/activate
    
    (.venv) $ python3 -m pip install django-smart-ratelimit
    Collecting django-smart-ratelimit
    [...]
    Successfully installed django-smart-ratelimit-4.12.1
    
    (.venv) $ python3 manage.py migrate
    Operations to perform:
      Apply all migrations: admin, auth, contenttypes, polls, sessions, users
    [...]
    
    (.venv) $ python3 manage.py loaddata db.json
    Installed 48 object(s) from 1 fixture(s)
    
    (.venv) $ python3 manage.py runserver
