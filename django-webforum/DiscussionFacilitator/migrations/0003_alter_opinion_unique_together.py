# Generated by Django 4.2 on 2023-04-23 00:17

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('DiscussionFacilitator', '0002_alter_opinion_trustlevel'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='opinion',
            unique_together={('author', 'link')},
        ),
    ]