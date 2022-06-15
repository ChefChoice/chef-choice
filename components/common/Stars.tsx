import { StarIcon } from '@heroicons/react/outline';

const Stars = ({ stars }: { stars: number }) => {
  const starIcons = [];

  for (let i = 0; i < 5; i++) {
    starIcons.push(
      <StarIcon key={i} className={`h-8 w-8 stroke-1 ` + (i < stars && `fill-black`)} />
    );
  }

  return <div className="flex lg:ml-auto">{starIcons}</div>;
};

export default Stars;
