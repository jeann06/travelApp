import axios from "axios";

export default async function handler(req, res) {
  const query = req.query;
  let { page } = query;
  page = page ? Number(page) : 1;
  const itemsPerPage = 4;
  try {
    const response = await axios.post(
      "http://localhost:8080/post/search?sortBy=createdDate&sortDir=asc",
      {},
      {
        headers: {
          Authorization: req.headers["authorization"],
        },
      }
    );

    // handle pagination
    const items = response.data.data;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return res.status(200).json({
      data: pageItems,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: "something went wrong" });
  }
}
