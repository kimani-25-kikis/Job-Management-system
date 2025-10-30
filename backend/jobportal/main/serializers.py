# main/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.conf import settings
from .models import Job, JobApplication


class JobOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class JobSerializer(serializers.ModelSerializer):
    job_owner = JobOwnerSerializer(read_only=True)
    job_owner_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='job_owner',
        write_only=True,
        required=False
    )

    class Meta:
        model = Job
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'image']

    def get_image(self, obj):
        if hasattr(obj, 'profile') and obj.profile.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile.image.url)
            return f"{settings.MEDIA_URL}{obj.profile.image.name}"
        return None


class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(), write_only=True, source='job'
    )
    user = UserSerializer(read_only=True)
    resume = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_id', 'user', 'resume',
            'cover_letter', 'status', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']

    def get_resume(self, obj):
        if obj.resume:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume.url)
            return f"{settings.MEDIA_URL}{obj.resume.name}"
        return None