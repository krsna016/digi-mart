export default function AdminEditProduct({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <p>Editing Product ID: {params.id}</p>
    </div>
  );
}
