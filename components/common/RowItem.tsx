interface IRowItemProps {
  key: number;
  rowID: number;
  title: string;
  subtitle?: string;
  image?: React.ReactNode;
  optionalNode?: React.ReactNode;
  optionalNodeRightAligned?: boolean;
}

const RowItem = ({
  // key, React is dumb
  rowID,
  title,
  subtitle,
  image,
  optionalNode,
  optionalNodeRightAligned = false,
}: IRowItemProps) => {
  return (
    <div key={rowID}>
      <div className="grid grid-rows-8 grid-cols-8 gap-y-4 justify-items-center text-center md:justify-items-start md:text-left md:grid-flow-col">
        <div className={`row-span-7 col-span-8 md:row-span-2`}>
          <div className="flex flex-col md:flex-row md:space-x-7">
            {image && <div className="min-w-fit">{image}</div>}
            <div className="flex flex-col">
              <p className="text-2xl">{title}</p>
              {subtitle && <p className="text-xs md:text-sm">{subtitle}</p>}
            </div>
          </div>
        </div>
        {optionalNode && (
          <div
            className={`row-span-1 col-span-8 self-center ${
              optionalNodeRightAligned && 'md:justify-self-end'
            }`}
          >
            {optionalNode}
          </div>
        )}
      </div>
    </div>
  );
};

export default RowItem;
