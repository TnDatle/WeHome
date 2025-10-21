export const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    const docRef = await db.collection("Products").add(newProduct);
    res.json({ id: docRef.id, ...newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
