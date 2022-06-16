const ContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto h-1/3 max-w-screen-2xl px-5 py-12 md:h-screen md:w-11/12">
      {children}
    </div>
  );
};

export default ContentContainer;
