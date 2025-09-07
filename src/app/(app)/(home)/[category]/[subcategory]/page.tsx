interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

const CategoryPage = async ({ params }: Props) => {
  const { category, subcategory } = await params;
  return (
    <div>
      Category: {category}, Subcategory: {subcategory}
    </div>
  );
};

export default CategoryPage;
