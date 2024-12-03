import { useNavigate, useParams } from "react-router";
import { useProduct } from "../hooks/products";

export const ProductView = () => {
  const { id } = useParams();
  const { data: product } = useProduct(id);
  const navigate = useNavigate();

  if (!product) return null;

  const media = product.medias[0];

  return (
    <div className="flex flex-col gap-4">
      <button
        className="text-sm bg-neutral-800 hover:bg-neutral-700 w-full flex transition-colors duration-75 p-2 rounded-md"
        onClick={() => navigate("/products")}
      >
        Back to products
      </button>
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
