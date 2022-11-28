interface IPublic {
  children?: JSX.Element;
}

export default function Public({ children }: IPublic): JSX.Element {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
