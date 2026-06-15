from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_admin_user(apps, schema_editor):
    """Create a demo admin user if it doesn't exist."""
    User = apps.get_model('auth', 'User')
    
    if not User.objects.filter(username='admin').exists():
        User.objects.create(
            username='admin',
            email='admin@taxwiseai.com',
            password=make_password('admin123'),
            is_staff=True,
            is_superuser=True,
        )
        print("✓ Demo admin user created: username='admin', password='admin123'")


def delete_admin_user(apps, schema_editor):
    """Delete the demo admin user."""
    User = apps.get_model('auth', 'User')
    User.objects.filter(username='admin').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('assistant', '0001_initial'),  # Adjust based on your existing migrations
    ]

    operations = [
        migrations.RunPython(create_admin_user, delete_admin_user),
    ]
