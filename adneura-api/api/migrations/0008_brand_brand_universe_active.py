# Generated by Django 5.1.6 on 2025-03-26 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_trigger_territory'),
    ]

    operations = [
        migrations.AddField(
            model_name='brand',
            name='brand_universe_active',
            field=models.BooleanField(blank=True, default=False),
        ),
    ]
