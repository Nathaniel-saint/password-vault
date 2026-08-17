from rest_framework import serializers
from .models import Domain
from .utils import encrypt_data, decrypt_data

class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def create(self, validated_data):
        if 'site_password' in validated_data:
            validated_data['site_password'] = encrypt_data(validated_data['site_password'])
        
        if 'note' in validated_data and validated_data['note']:
            validated_data['note'] = encrypt_data(validated_data['note'])

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'site_password' in validated_data:
            validated_data['site_password'] = encrypt_data(validated_data['site_password'])
            
        if 'note' in validated_data and validated_data['note']:
            validated_data['note'] = encrypt_data(validated_data['note'])

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        """
        Decrypt values when fetching data so the frontend receives readable text.
        """
        ret = super().to_representation(instance)
        
        try:
            if ret.get('site_password'):
                ret['site_password'] = decrypt_data(ret['site_password'])
            if ret.get('note'):
                ret['note'] = decrypt_data(ret['note'])
        except Exception:
            # Fallback in case of unencrypted legacy records
            pass

        return ret