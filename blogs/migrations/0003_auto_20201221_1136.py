# Generated by Django 2.2.2 on 2020-12-21 06:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0002_authusers_role_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='authusers',
            name='role_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blogs.Role'),
        ),
    ]
