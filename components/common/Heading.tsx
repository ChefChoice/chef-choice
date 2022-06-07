interface IHeadingProps {
  title: string;
  optionalNode?: React.ReactNode;
  optionalNodeRightAligned?: boolean;
}

const Header = ({ title, optionalNode, optionalNodeRightAligned = false }: IHeadingProps) => {
  return (
    <>
      <div
        className={`grid grid-rows-${
          optionalNode ? 2 : 1
        } lg:grid-rows-1 grid-cols-8 justify-items-center items-center text-center mb-3 gap-y-3`}
      >
        <div className={`col-span-8 lg:justify-self-start lg:col-span-${optionalNode ? 4 : 8}`}>
          <p className="text-3xl">{title}</p>
        </div>
        {optionalNode && (
          <div
            className={`col-span-8 lg:col-span-4 ${
              optionalNodeRightAligned && 'lg:justify-self-end'
            }`}
          >
            {optionalNode}
          </div>
        )}
      </div>
      <hr className="mb-5 border-t-2 border-black/[.50]" />
    </>
  );
};

export default Header;
