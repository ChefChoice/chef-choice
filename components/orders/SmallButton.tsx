const SmallButton = ({ data }: { data: string }) => {
  return (
    <div className="cursor-pointer rounded-md border border-solid border-black px-10 py-1 text-center">
      {data}
    </div>
  );
};

export default SmallButton;
