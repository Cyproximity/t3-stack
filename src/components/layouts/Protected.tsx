interface IProtected {
  children?: JSX.Element;
}

export default function Protected({ children }: IProtected): JSX.Element {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
