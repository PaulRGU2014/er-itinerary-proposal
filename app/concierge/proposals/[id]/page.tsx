interface ProposalItem {
  id: string;
  category: string;
  title: string;
  price: number;
}

interface Proposal {
  id: string;
  status: string;
  items: ProposalItem[];
}

export default async function ProposalEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`http://localhost:3000/api/proposals/${id}`, {
    cache: "no-store",
  });
  const proposal: Proposal = await res.json();

  return (
    <div style={{ padding: 24 }}>
      <h1>Proposal #{proposal.id}</h1>
      <p>Status: {proposal.status}</p>

      <h2>Items</h2>
      <ul>
        {proposal.items.map((item: ProposalItem) => (
          <li key={item.id}>
            <strong>{item.category}</strong>: {item.title} — $
            {item.price}
          </li>
        ))}
      </ul>

      <h3>Add Item</h3>
      <form action={`/api/proposals/${id}/items`} method="POST">
        <label htmlFor="category">Category</label>
        <input id="category" name="category" placeholder="Category" required />
        <label htmlFor="title">Title</label>
        <input id="title" name="title" placeholder="Title" required />
        <label htmlFor="description">Description</label>
        <input id="description" name="description" placeholder="Description" />
        <label htmlFor="scheduledAt">Scheduled at</label>
        <input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
        <label htmlFor="price">Price</label>
        <input id="price" name="price" type="number" required />
        <button type="submit">Add Item</button>
      </form>

      <hr style={{ margin: "24px 0" }} />

      <form action={`/api/proposals/${id}/send`} method="POST">
        <button type="submit">Send Proposal</button>
      </form>
    </div>
  );
}
