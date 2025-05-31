type LoaderProps = {
  color: string;
};

export const Loader = ({ color }: LoaderProps) => {
  return (
    <div
      className={`h-6 w-6 animate-spin rounded-full border border-t-transparent border-${
        color ?? "primary"
      }`}
    ></div>
  );
};
