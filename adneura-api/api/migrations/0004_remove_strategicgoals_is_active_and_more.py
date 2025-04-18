# Generated by Django 5.1.4 on 2025-02-07 05:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_strategicgoals_is_active'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='strategicgoals',
            name='is_active',
        ),
        migrations.AddField(
            model_name='brand',
            name='ad_legacy_active',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name='brand',
            name='brand_summary_active',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name='brand',
            name='strategic_goals_active',
            field=models.BooleanField(blank=True, default=False),
        ),
    ]
