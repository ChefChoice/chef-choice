interface IRowItemProps {
  key: number;
  title: string;
  subtitle?: string;
  image?: React.ReactNode;
  optionalNode?: React.ReactNode;
  optionalNodeRightAligned?: boolean;
}

const RowItem = ({
  key,
  title,
  subtitle,
  image,
  optionalNode,
  optionalNodeRightAligned = true,
}: IRowItemProps) => {
  return (
    <div key={key}>
      <div className="grid grid-cols-2">
        <div className="flex flex-row space-x-3">
          {image && <div>{image}</div>}
          <div className="flex flex-col">
            <p className="text-base md:text-2xl">{title}</p>
            {subtitle && <p className="text-xs md:text-sm">{subtitle}</p>}
          </div>
        </div>
        {optionalNode && (
          <div className={`self-center ${optionalNodeRightAligned ? 'justify-self-end' : ''}`}>
            {optionalNode}
          </div>
        )}
      </div>
    </div>
  );
};

export default RowItem;
