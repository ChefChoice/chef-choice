interface IHeadingProps {
  title: string;
  optionalNode?: React.ReactNode;
  optionalNodeRightAligned?: boolean;
}

const Header = ({ title, optionalNode, optionalNodeRightAligned = true }: IHeadingProps) => {
  return (
    <>
      <div className="grid grid-cols-8 items-center mb-3">
        <div className="col-span-2">
          <p className="text-3xl">{title}</p>
        </div>
        {optionalNode && (
          <div className={`col-span-6 ${optionalNodeRightAligned ? 'justify-self-end' : ''}`}>
            {optionalNode}
          </div>
        )}
      </div>
      <hr className="mb-5 border-t-2 border-black/[.50]" />
    </>
  );
};

export default Header;
