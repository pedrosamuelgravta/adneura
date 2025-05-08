from api.models.brand import Brand
from api.models.brand_info import BrandInfo


class BrandRepository:

    @staticmethod
    def find_by_id(id):
        return Brand.objects.filter(id=id).first()
