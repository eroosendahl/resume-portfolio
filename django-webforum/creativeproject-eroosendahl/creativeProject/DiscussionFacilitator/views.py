from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.urls import reverse
from .models import Discussion, Link, Comment, Like, Opinion, InitialLinkOpinion
from .forms import newDiscussionForm
from django.contrib.auth.models import User
import logging
from django.utils import timezone

# Create your views here.

def hello(request):
    text = "henlo wurld"
    return HttpResponse(text)

def verifyLogin(request):
    text = "placehold this!"
    return HttpResponse(text)

def dashboard(request):
    return render(request, "users/dashboard.html")

def register(request):
    if request.method == "GET":
        return render(
            request, "registration/register.html",
            {"form": UserCreationForm}
        )
    elif request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return HttpResponseRedirect(reverse("home"))  # https://stackoverflow.com/questions/11241668/what-is-reverse
        
def dfHub(request):
    curUser = User.objects.get(username=request.user)
    curUserDiscussions = curUser.discussion_set.all()
    return render(request, "dfHub.html", {"curUserDiscussions":curUserDiscussions})

def discussionCreator(request):
    return render(request, "createDisc.html", {"form":newDiscussionForm})

def createDiscussion(request):
    author = request.user
    discussionTitle = request.POST.get('discussionTitle', "ERROR_OCCURED")
    initialLink = request.POST.get('initialLink', "ERROR_OCCURED")
    initialComment = request.POST.get('initialComment', "ERROR_OCCURED")
    try:
        Discussion(author=author, discussionTitle=discussionTitle, initialLink=initialLink, initialComment=initialComment).save()
    except:
        return render(
            request,
            "bad.html"
        )
    else:
        return HttpResponseRedirect(reverse("opComplete"))

def publicDiscussions(request):
    discussions = Discussion.objects.values()
    for discussion in discussions:
        discussion['totalLikes'] = Like.objects.filter(discussion=discussion['id']).count()
        discussion['totalComments'] = Comment.objects.filter(discussion=discussion['id']).count()+1 # +1 for the author's initial comment
        discussion['creationTimestamp']
    return render(request, "publicDiscs.html", {"discussions":discussions})

def opComplete(request):
    return render(request, "opComplete.html")

def discussionViewer(request, discussionID):
    discussion = get_object_or_404(Discussion, pk=discussionID)
    try:
        discussionLinks = Link.objects.filter(discussion=discussionID)
        discussionComments = Comment.objects.filter(discussion=discussionID)
        isLiked = not not Like.objects.filter(discussion=discussionID).filter(author=request.user)
        totalLikes = Like.objects.filter(discussion=discussionID).count()
        allOpinions = Opinion.objects.all()
        userOpinions = allOpinions.filter(author=request.user)
    except:
        return HttpResponseRedirect(reverse("error"))
    # links user's opinion of each of the discussions links to that link
    # loop also gathers total Trust and Doubt counts for each link
    linkedOpinions = {}
    linkedCounts = {}
    for link in discussionLinks:
        linkedCounts[link] = {"Trust":0,"Doubt":0}
        for opinion in allOpinions.filter(link=link):
            linkedCounts[link][opinion.trustLevel] += 1
        try:
            thisUsersOpinionForThisLink = userOpinions.get(link=link)
            linkedOpinions[link] = thisUsersOpinionForThisLink.trustLevel
        except:pass
            
    try: 
        usersInitialLinkOpinion = InitialLinkOpinion.objects.filter(discussion=discussionID).get(author=request.user).trustLevel
    except: usersInitialLinkOpinion = "None"
    
    initialLinkOpinionCounts = {
        "Trust":0,
        "Doubt":0
    }

    try:
        initialLinkOpinionCounts["Trust"] = InitialLinkOpinion.objects.filter(discussion=discussionID).filter(trustLevel="Trust").count()
    except:
        initialLinkOpinionCounts["Trust"] = 0
    
    try:
        initialLinkOpinionCounts["Doubt"] = InitialLinkOpinion.objects.filter(discussion=discussionID).filter(trustLevel="Doubt").count()
    except:
        initialLinkOpinionCounts["Doubt"] = 0
    logging.debug("usersInitialLinkOpinion = " + usersInitialLinkOpinion)
    logging.warning("usersInitialLinkOpinion = " + usersInitialLinkOpinion)
    return render(request, 
        "discussionViewer.html", 
        {
            "discussion":discussion, 
            "discussionLinks": discussionLinks, 
            "discussionComments":discussionComments, 
            "isLiked":isLiked,
            "totalLikes":totalLikes,
            "linkedOpinions":linkedOpinions,
            "linkedCounts":linkedCounts,
            "usersInitialLinkOpinion":usersInitialLinkOpinion,
            "initialLinkOpinionCounts":initialLinkOpinionCounts
        })


def discussionLinkCreator(request, discussionID):
    linkActual = request.POST.get('inputContent', "ERROR_OCCURED")
    Discussion.objects.get(id=discussionID).link_set.create(author=request.user, link=linkActual)
    return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))

def discussionCommentCreator(request, discussionID):
    commentActual = request.POST.get('inputContent', "ERROR_OCCURED")
    Discussion.objects.get(id=discussionID).comment_set.create(author=request.user, comment=commentActual)
    return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))

def liker(request, discussionID):
    try:
        Discussion.objects.get(id=discussionID).like_set.create(author=request.user)
    except:
        return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))
    else:
        return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))
    

def unliker(request, discussionID):
    try:
        Discussion.objects.get(id=discussionID).like_set.get(author=request.user).delete()
    except:
        return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))
    else:
        return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))
    
def touchOpinion(request, discussionID, linkID, trustLevel):
    try:
        link = Link.objects.get(id=linkID)
    except:
        logging.warning("1")
        return HttpResponseRedirect(reverse("error"))
    
    try:
        currentOpinion = link.opinion_set.get(author=request.user)
        currentOpinion.trustLevel = trustLevel
        currentOpinion.save()
    except:
        logging.warning("2")
        Opinion(author=request.user, link=link, trustLevel=trustLevel).save()
        return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))

    else:
        return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))
    
def touchILOpinion(request, discussionID, trustLevel):
    logging.warning("REACHED touchILOpinion")
    try:
        discussion = Discussion.objects.get(id=discussionID)
        currentOpinion = discussion.initiallinkopinion_set.get(author=request.user)
        if not currentOpinion:
            InitialLinkOpinion(author=request.user, discussion=discussion, trustLevel=trustLevel).save()
        else:
            currentOpinion.trustLevel = trustLevel
            currentOpinion.save()
    except:
        logging.warning("except!")
        InitialLinkOpinion(author=request.user, discussion=discussion, trustLevel=trustLevel).save()
        return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))
    else:
        return HttpResponseRedirect("/df/discussionViewer/"+str(discussionID))
    
def error(request):
    return render(request, "error.html")
    

