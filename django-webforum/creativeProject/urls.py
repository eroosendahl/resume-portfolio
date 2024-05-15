"""
URL configuration for creativeProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import TemplateView
from DiscussionFacilitator import views as dfViews

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path("admin/", admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")),
    path("accounts/register", dfViews.register, name='register'),
    path('df/', dfViews.dfHub, name='dfHub'),
    path("df/discussionCreator", dfViews.discussionCreator, name="discussionCreator"),
    path("df/createDiscussion", dfViews.createDiscussion, name="createDiscussion"),
    path("df/publicDiscussions", dfViews.publicDiscussions, name="publicDiscussions"),
    path("df/opComplete", dfViews.opComplete, name="opComplete"),
    path("df/discussionViewer/<int:discussionID>/", dfViews.discussionViewer, name="discussionViewer"),
    path("df/discussionLinkCreator/<int:discussionID>", dfViews.discussionLinkCreator, name="discussionLinkCreator"),
    path("df/discussionCommentCreator/<int:discussionID>", dfViews.discussionCommentCreator, name="discussionCommentCreator"),
    path("df/liker/<int:discussionID>", dfViews.liker, name="liker"),
    path("df/unliker/<int:discussionID>", dfViews.unliker, name="unliker"),
    path("df/touchOpinion/<int:discussionID>/<int:linkID>/<str:trustLevel>/", dfViews.touchOpinion, name="touchOpinion"),
    path("df/touchILOpinion/<int:discussionID>/<str:trustLevel>/", dfViews.touchILOpinion, name="touchILOpinion"),
    path('error', dfViews.error, name='error'),
]
