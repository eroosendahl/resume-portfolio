# Generated by Django 4.2 on 2023-04-23 03:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('DiscussionFacilitator', '0003_alter_opinion_unique_together'),
    ]

    operations = [
        migrations.CreateModel(
            name='InitialLinkOpinion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('trustLevel', models.CharField(max_length=100)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('discussion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='DiscussionFacilitator.discussion')),
            ],
            options={
                'unique_together': {('author', 'discussion')},
            },
        ),
    ]