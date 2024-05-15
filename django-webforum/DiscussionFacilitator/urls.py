from django.urls import path

from . import views

app_name = "DiscussionFacilitator"
urlpatterns = [
    path("", views.dfHub, name="dfHub"),
]