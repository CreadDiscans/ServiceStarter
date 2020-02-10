# Generated by Django 2.2.8 on 2020-02-08 05:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShopCart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isOpen', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name_plural': '장바구니',
            },
        ),
        migrations.CreateModel(
            name='ShopProduct',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('price', models.IntegerField(default=0)),
                ('valid', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name_plural': '상품',
            },
        ),
        migrations.AlterField(
            model_name='media',
            name='boarditem',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.BoardItem'),
        ),
        migrations.CreateModel(
            name='ShopPayment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imp_uid', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=100)),
                ('paid_amount', models.IntegerField(default=0)),
                ('buyer_name', models.CharField(blank=True, max_length=100, null=True)),
                ('buyer_email', models.CharField(blank=True, max_length=100, null=True)),
                ('buyer_tel', models.CharField(blank=True, max_length=100, null=True)),
                ('buyer_addr', models.CharField(blank=True, max_length=200, null=True)),
                ('buyer_postcode', models.CharField(blank=True, max_length=100, null=True)),
                ('cart', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.ShopCart')),
            ],
            options={
                'verbose_name_plural': '결재내역',
            },
        ),
        migrations.AddField(
            model_name='shopcart',
            name='product',
            field=models.ManyToManyField(to='api.ShopProduct'),
        ),
        migrations.AddField(
            model_name='shopcart',
            name='profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Profile'),
        ),
        migrations.AddField(
            model_name='media',
            name='shopproduct',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.ShopProduct'),
        ),
    ]