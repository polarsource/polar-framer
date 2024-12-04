import { Link, useNavigate, useParams } from "react-router";
import { useProduct } from "../hooks/products";

export const ProductView = () => {
  const { id } = useParams();
  const { data: product } = useProduct(id);
  const navigate = useNavigate();

  if (!product) return null;

  const media = product.medias[0];

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link
        to="/products"
        className="text-sm text-blue-500 hover:text-blue-400 transition-colors duration-75"
      >
        Back to products
      </Link>
      <h1 className="text-xl font-medium">{product.name}</h1>
      {media && (
        <img
          className="w-full rounded-md text-lg"
          src={media.publicUrl}
          alt={product.name}
        />
      )}
      <p>{product.description}</p>
    </div>
  );
};
