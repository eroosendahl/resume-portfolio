import datetime
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class Discussion(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    discussionTitle = models.CharField(max_length=200)
    initialLink = models.CharField(max_length=1000)
    initialComment = models.CharField(max_length=1000)
    creationTimestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.discussionTitle
    
class Link(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    link = models.CharField(max_length=1000)
    # https://stackoverflow.com/questions/8016412/in-django-do-models-have-a-default-timestamp-field
    creationTimestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.link

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    comment = models.CharField(max_length=1000)
    creationTimestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.comment

class Like(models.Model):
    class Meta:
        unique_together = (("author", "discussion"))
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)

class Opinion(models.Model):
    class Meta:
        unique_together = (("author", "link"))
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    link = models.ForeignKey(Link, on_delete=models.CASCADE)
    trustLevel = models.CharField(max_length=100)

class InitialLinkOpinion(models.Model):
    class Meta:
        unique_together = (("author", "discussion"))
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    trustLevel = models.CharField(max_length=100)
    def __str__(self):
        return self.trustLevel
