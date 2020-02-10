# Generated by Django 2.2.8 on 2020-02-09 08:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_auto_20200209_0816'),
    ]

    operations = [
        migrations.AddField(
            model_name='shopbilling',
            name='card',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.ShopCard'),
        ),
        migrations.AddField(
            model_name='shopbilling',
            name='profile',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.Profile'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='shopbilling',
            name='subscription',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.ShopSubscription'),
        ),
        migrations.AddField(
            model_name='shopcard',
            name='profile',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.Profile'),
            preserve_default=False,
        ),
    ]