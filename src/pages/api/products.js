import {
  getInitialProducts,
  addProductToList,
  updateProduct,
} from "../../lib/products";

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { method } = req;

  switch (method) {
    case "GET":
      const dataInit = getInitialProducts(); // this is not very good
      // if query, check for id then find and send match!
      if (Object.keys(req.query).length) {
        const id = parseInt(req.query.id);
        const match = dataInit.find((product) => {
          return product.id === id;
        });
        if (!match) {
          res
            .status(404)
            .json({ message: `Product with id ${id} was not found` });
          return;
        }
        res.status(200).json(match);
        return;
      }
      // else, normal GET
      res.status(200).json(dataInit);
      break;

    case "POST":
      if (!req.body) {
        res.status(400).json({ message: "Product could not be added" });
      }
      const { startDate, productName, Developers } = req.body;
      if (!startDate || !productName || Developers.length === 0) {
        res.status(403).json({ message: "Invalid product data" });
        return;
      }
      const newProducts = addProductToList(req.body);
      res.status(200).json(newProducts);
      // *** send anything else so latest data availble for GET???

      // const { data: updatedData, newProduct } = addProductToList(req.body);
      // res.status(200).json({ data: updatedData, newProduct });
      break;

    case "PUT":
      const { products, dataObj } = req.body;
      const { data, editIndex } = updateProduct(products, dataObj);
      if (editIndex === -1) {
        res
          .status(404)
          .json({ message: `Product #${editIndex} could not be edited.` });
      } else {
        res.status(200).json(data);
      }
      break;

    case "DELETE":
      res.status(200);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
