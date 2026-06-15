from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer


@api_view(["GET"])
def product_list(request):
    """Return all products ordered by price."""
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def product_detail(request, product_id):
    """Return a single product by product_id slug."""
    try:
        product = Product.objects.get(product_id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": f"Product '{product_id}' not found."},
            status=status.HTTP_404_NOT_FOUND,
        )
    serializer = ProductSerializer(product)
    return Response(serializer.data)
