const ContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-screen-2xl px-5 md:h-screen h-1/3 md:w-11/12 py-12">
      {children}
    </div>
  );
};

export default ContentContainer;
