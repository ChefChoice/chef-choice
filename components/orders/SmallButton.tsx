const SmallButton = ({ data }: { data: string }) => {
  return (
    <div className="cursor-pointer rounded border-2 border-solid border-black px-10 py-2 text-center">
      {data}
    </div>
  );
};

export default SmallButton;
