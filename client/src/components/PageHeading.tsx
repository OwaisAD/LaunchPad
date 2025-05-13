type PageHeadingProps = {
  title: string;
  description?: string;
};

const PageHeading = ({ title, description }: PageHeadingProps) => {
  return (
    <div>
      <h1 className="text-3xl text-gray-800">{title}</h1>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
    </div>
  );
};

export default PageHeading;
