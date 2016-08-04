from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.db import models

# class UserDetail(models.Model):
#     name = models.CharField(max_length=50,default="")
#     email = models.CharField(max_length=50,default="")
#     password = models.CharField(max_length=50,default="")
#     user = models.OneToOneField(User)
#
#     def __unicode__(self):
#         return self.name


class Exam(models.Model):
    name = models.CharField(max_length=100,default="")
    user = models.ForeignKey(User)

    def __unicode__(self):
        return self.name


class Question(models.Model):
    question = models.TextField(max_length=200,default="")
    option1 = models.CharField(max_length=50,default="")
    option2 = models.CharField(max_length=50, default="")
    option3 = models.CharField(max_length=50, default="")
    option4 = models.CharField(max_length=50, default="")
    answer = models.CharField(max_length=50, default="")
    exam = models.ForeignKey(Exam)

    def __unicode__(self):
        return self.question
