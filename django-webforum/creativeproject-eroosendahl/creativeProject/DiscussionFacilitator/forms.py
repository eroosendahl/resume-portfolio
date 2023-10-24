from django import forms

class newDiscussionForm(forms.Form):
    discussionTitle = forms.CharField(label="Title:", max_length=200)
    initialLink = forms.CharField(label="Initial link:", max_length=1000)
    initialComment = forms.CharField(label="Initial comment:", max_length=1000)
