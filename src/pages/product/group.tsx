import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const CreateProductForm = dynamic(() => import("../../components/ProductGroupForm"), { ssr: false })

const ProductCreate: NextPage = () => {
  return (
    <>
      <Link href="/product">Back</Link>
      <CreateProductForm />
    </>
  )
}

export default ProductCreate;
