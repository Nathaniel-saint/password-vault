from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8 , style ={'input_type': 'password'})

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
    class Meta:
        model = CustomUser
        fields = ('id', 'fullname', 'email', 'password')