import { useNavigate } from "react-router-dom";

interface BrandListProps {
  brands: any[];
}

const BrandList = ({ brands }: BrandListProps) => {
  const navigate = useNavigate();

  const handleClick = (id: string | number) => {
    navigate(`/brand/${id}`);
  };

  return (
    <div className="w-[50rem] mx-auto">
      <p className="font-bold text-2xl my-4 ml-1">Brands</p>
      <div className="grid gap-3 grid-cols-3 w-[50rem] mx-auto">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-[#e2e2e2cc] p-4 m-1 flex flex-col  items-center  gap-3 rounded-sm transition-all hover:shadow-md cursor-pointer"
            onClick={() => handleClick(brand.id)}
          >
            <h2 className="text-gray-900">{brand.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandList;
