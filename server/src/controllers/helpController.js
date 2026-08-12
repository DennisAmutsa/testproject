// GET /api/help/topics  - popular help topics (dynamic, from DB or static)
export const getHelpTopics = async (req, res) => {
  const topics = [
    { id: 1, question: 'Where is my order?', category: 'orders', link: '/orders' },
    { id: 2, question: 'How long do refunds take?', category: 'returns', link: '/returns' },
    { id: 3, question: 'Can I return my order?', category: 'returns', link: '/returns' },
    { id: 4, question: 'Is my item back in stock?', category: 'stock', link: '/stock' },
    { id: 5, question: 'How do I change my delivery address?', category: 'orders', link: '/orders' },
    { id: 6, question: 'What payment methods do you accept?', category: 'general', link: '/help' },
  ];
  res.json(topics);
};

// GET /api/help/search?q=...  - search help topics
export const searchHelp = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Search query required' });

  const allTopics = [
    { id: 1, question: 'Where is my order?', category: 'orders', link: '/orders' },
    { id: 2, question: 'How long do refunds take?', category: 'returns', link: '/returns' },
    { id: 3, question: 'Can I return my order?', category: 'returns', link: '/returns' },
    { id: 4, question: 'Is my item back in stock?', category: 'stock', link: '/stock' },
    { id: 5, question: 'How do I change my delivery address?', category: 'orders', link: '/orders' },
    { id: 6, question: 'What payment methods do you accept?', category: 'general', link: '/help' },
    { id: 7, question: 'How do I track my shipment?', category: 'orders', link: '/orders' },
    { id: 8, question: 'When will I get my refund?', category: 'returns', link: '/returns' },
    { id: 9, question: 'Do you have this in a different size?', category: 'stock', link: '/stock' },
  ];

  const results = allTopics.filter(t =>
    t.question.toLowerCase().includes(q.toLowerCase()) ||
    t.category.toLowerCase().includes(q.toLowerCase())
  );
  res.json(results);
};
