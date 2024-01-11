import fetcher from "@/utils/fetcher";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MapPin, Search, Star } from "react-feather";
import ReactPaginate from "react-paginate";
import {
  Button,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
} from "reactstrap";

export default function PlacesPage(props) {
  const { data, content, categoriesData, query } = props;
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [selectedFilter, setSelectedFilter] = useState({
    sortBy: "createdDate",
    sortDir: "desc",
  });
  const handleFilterSelect = (filter) => {
    // Update the selected filter when an option is clicked
    setSelectedFilter(filter);
    // Implement filtering logic here based on the selected filter
    // For example, update the API call with the selected filter
    router.push({
      pathname: router.pathname,
      query: {
        sortBy: filter.sortBy,
        sortDir: filter.sortDir,
      },
    });
  };

  const getFilterLabel = (selectedFilter) => {
    if (
      selectedFilter.sortBy === "createdDate" &&
      selectedFilter.sortDir === "desc"
    ) {
      return "Newest";
    } else if (
      selectedFilter.sortBy === "createdDate" &&
      selectedFilter.sortDir === "asc"
    ) {
      return "Oldest";
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Implement search logic here
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: searchTerm,
      },
    });
  };

  const [categories, setCategories] = useState([]);

  return (
    <div>
      <Container className="align-items-center justify-content-center">
        <div className="row">
          <div className="col-2 py-4">
            <span className="fw-bold fs-5">Filtering</span>
            <div className="card mt-2 py-3">
              <div className="px-3" style={{ fontSize: "15px" }}>
                <div className="fw-semibold fs-6 mb-2">Category</div>
                {categoriesData.map((item, index) => (
                  <div className="" key={index}>
                    <Input
                      id={item.category}
                      name={item.category}
                      type="checkbox"
                      className="me-2"
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setCategories((prev) => [...prev, item]);
                        } else {
                          setCategories((prev) =>
                            prev.filter((p) => p.id !== item.id)
                          );
                        }
                      }}
                    />
                    <Label for={item.category}>{item.category}</Label>
                  </div>
                ))}
              </div>
              <Button
                color="primary"
                type="button"
                onClick={() => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      categories:
                        categories.length > 0 ? JSON.stringify(categories) : "",
                    },
                  });
                }}
              >
                Submit
              </Button>
              <div className="px-3 mt-2" style={{ fontSize: "15px" }}>
                <div className="fw-semibold fs-6 mb-2">City</div>
                <div className="">
                  <Input
                    id="jakarta-pusat"
                    name="jakarta-pusat"
                    type="checkbox"
                    className="me-2"
                  ></Input>
                  <Label>Jakarta Pusat</Label>
                </div>
                <div className="">
                  <Input
                    id="jakarta-timur"
                    name="jakarta-timur"
                    type="checkbox"
                    className="me-2"
                  ></Input>
                  <Label>Jakarta Timur</Label>
                </div>
                <div className="">
                  <Input
                    id="jakarta-utara"
                    name="jakarta-utara"
                    type="checkbox"
                    className="me-2"
                  ></Input>
                  <Label>Jakarta Utara</Label>
                </div>
                <div className="">
                  <Input
                    id="jakarta-selatan"
                    name="jakarta-selatan"
                    type="checkbox"
                    className="me-2"
                  ></Input>
                  <Label>Jakarta Selatan</Label>
                </div>
                <div className="">
                  <Input
                    id="jakarta-barat"
                    name="jakarta-barat"
                    type="checkbox"
                    className="me-2"
                  ></Input>
                  <Label>Jakarta Barat</Label>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-10">
            <div className="d-flex py-4 align-items-center justify-content-between">
              <h1 className="">Places Page</h1>
              <div className="d-flex">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "250px",
                    height: "36px",
                    fontSize: "14px",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
                <Button
                  color="secondary"
                  className="me-3 d-flex align-items-center justify-content-center"
                  onClick={handleSearch}
                  style={{
                    height: "36px",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <Search size={18} />
                </Button>

                <Dropdown
                  className="me-3"
                  isOpen={filterOpen}
                  toggle={toggleFilter}
                >
                  <DropdownToggle
                    caret
                    color="light"
                    className="border text-start align-caret-right"
                    style={{ minWidth: "150px" }}
                  >
                    {getFilterLabel(selectedFilter)}
                  </DropdownToggle>
                  <DropdownMenu className="mt-1" style={{ minWidth: "150px" }}>
                    <DropdownItem
                      onClick={() =>
                        handleFilterSelect({
                          sortBy: "createdDate",
                          sortDir: "desc",
                        })
                      }
                    >
                      Newest
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        handleFilterSelect({
                          sortBy: "createdDate",
                          sortDir: "asc",
                        })
                      }
                    >
                      Oldest
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Button className="" color="primary" href={`places/addPlace`}>
                  Suggest Place
                </Button>
              </div>
            </div>

            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5">
              {content.map((item, index) => (
                <div key={index} className="col mb-4">
                  <Link
                    style={{ textDecoration: "none" }}
                    href={`/places/${item.id}`}
                  >
                    <div className="card" style={{ height: "325px" }}>
                      <img
                        src={`http://localhost:8080/${item.fileUrl}`}
                        class="card-img-top object-fit-cover"
                        width={150}
                        height={180}
                        alt=""
                      />
                      <div className="card-body">
                        <h6 className="card-title text-truncate">
                          {item.title}
                        </h6>
                        <p className="card-text text-truncate">
                          {item.description}
                        </p>
                        <span className="card-text">
                          <MapPin className="me-1" size={18} />
                          {item.city}
                        </span>
                        <p className="">
                          <Star
                            className="me-1"
                            size={18}
                            color="yellow"
                            fill="yellow"
                          />
                          {item.averageRating} ({item.totalRating})
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <ReactPaginate
                previousLabel="previous"
                nextLabel="next"
                onPageChange={({ selected }) => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      page: selected,
                    },
                  });
                }}
                // hrefBuilder={(page, pageCount, selected) =>
                //   page >= 1 && page <= data.totalPages ? `/places?page=${page}` : "#"
                // }
                // hrefAllControls
                pageCount={data.totalPages}
                breakLabel="..."
                pageRangeDisplayed={4}
                marginPagesDisplayed={2}
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                forcePage={data.number}
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const query = ctx.query;
  const page = query.page ?? 0;
  const size = query.size ?? 10;
  const sortBy = query.sortBy ?? "createdDate";
  const sortDir = query.sortDir ?? "desc";
  const categories = query.categories ? JSON.parse(query.categories) : null;

  const postData = {
    ...(categories && { categories: categories }),
  };
  const response = await fetcher.post(
    `/post/search?sortBy=${sortBy}&sortDir=${sortDir}&page=${page}&size=${size}`,
    postData
  );

  const data = response.data.data;
  const content = data.content;

  const categoriesResponse = await fetcher.get(`/category/getAll`);
  const categoriesData = categoriesResponse.data.data;

  return {
    props: {
      data,
      content,
      categoriesData,
      query,
    },
  };
}
