interface Props {
  params: Promise<{ category: string }>;
}

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;
  return <div>category: {category}</div>;
};

export default CategoryPage;
