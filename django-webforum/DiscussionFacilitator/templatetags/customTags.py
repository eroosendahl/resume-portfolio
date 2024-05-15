#https://realpython.com/django-template-custom-tags-filters/
from django import template
import logging

register = template.Library()

@register.filter
def getLinkedValue(linkedValues, link): #https://stackoverflow.com/questions/13376576/how-can-i-use-a-variable-as-index-in-django-template
    logging.warning(linkedValues)
    logging.warning(link)
    try: 
        return linkedValues[link]
    except:
        return "FilterFailure"
    
@register.filter
def indexByString(dict, stringKey): #https://stackoverflow.com/questions/13376576/how-can-i-use-a-variable-as-index-in-django-template
    try: 
        return dict[stringKey]
    except:
        return -1