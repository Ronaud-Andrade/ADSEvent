from django.contrib.auth.mixins import UserPassesTestMixin
from django.http import HttpResponseForbidden

class NotSuperUserMixin:
    def form_valid(self,form):
        user = self.request.user 
        if not user.is_superuser:
            form.instance.client = user
        return super().form_valid(form)

# class AdminOnlyMixin:
#     def test_func(self):
#         return self.request.user.is_superuser
#     def handle_no_permission(self):
#         return HttpResponseForbidden('walid')
    