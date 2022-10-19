import { FC } from "react";
import { useForm, Controller, UseControllerProps } from "react-hook-form";
import { trpc } from "../utils/trpc";

import { createProductGroupInput } from "../schema/product.schema";
import { useRouter } from "next/router";

const BooleanInput = ({ 
  control, 
  name 
}: UseControllerProps<createProductGroupInput>) => {
  return (
    <Controller 
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <>
          <div>Published</div>
          <label htmlFor="_yes">
            <input 
              id="_yes" 
              type="radio"
              onBlur={onBlur}
              onChange={() => onChange(true)}
              checked={value===true}
              ref={ref}
            />
            Yes
          </label>
          <label htmlFor="_no">
            <input
              id="_no"
              type="radio"
              onBlur={onBlur}
              onChange={() => onChange(false)}
              checked={value===false}
              ref={ref}
            />
            No
          </label>
        </>
      )}
    />
  );
};

const CreateProductGroupForm: FC = () => {
  const router = useRouter()
  const { mutate, isLoading, error } = trpc.products.createProductGroup.useMutation({
    onSuccess() {
      router.push("/product")
    }
  })
  const { control, watch, register, handleSubmit } = useForm<createProductGroupInput>({ 
    defaultValues: { published: false } 
  })
  
  const onSubmit = (data:createProductGroupInput) => {
    mutate(data)
  }

  if(isLoading) {
    return <>Loading</>
  }

  return (
    <>
      {error && error.message}  
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <div>Group name</div>
          <input type="text" placeholder="Enter product group" {...register("name")} />
        </div>
        <div>
          <div>Description (optional)</div>
          <textarea placeholder="product group description" {...register("description")}></textarea>
        </div>
        <div>
          <BooleanInput control={control} name={"published"} />
        </div>
        {JSON.stringify(watch())}
        <br />
        <button type="submit">Create Product Group</button>
      </form>
    </>
  )
};

export default CreateProductGroupForm
