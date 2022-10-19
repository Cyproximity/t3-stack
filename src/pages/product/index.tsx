import type { NextPage } from "next";

import Link from "next/link";
import { useUserContext } from "../../context/user.context";
import { trpc } from "../../utils/trpc";

const Product: NextPage = () => {
  const user = useUserContext();
  const { data, isLoading } = trpc.products.getAllProductGroups.useQuery();

  return (
   <>
    <div>
      <Link href="/product/group">Create Product Group</Link>
    </div>
    <div>
      <ul>
      {data && data.map(product => (
        <li key={product.id}><Link href={`/product/${encodeURIComponent(product.id)}`}>{product.name}</Link></li>)
      )}
      </ul>
    </div>
    <pre>{user && JSON.stringify(user, null, 2)}</pre>
    <br />
    <pre>{data && JSON.stringify(data, null, 2)}</pre>
   </>
  );  
};

export default Product;
