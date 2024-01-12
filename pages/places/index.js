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
  const [searchQuery, setSearchQuery] = useState(query?.search ?? "");
  const [filterOpen, setFilterOpen] = useState(false);
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [selectedFilter, setSelectedFilter] = useState({
    sortBy: "createdDate",
    sortDir: "desc",
  });
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
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
      selectedFilter.sortBy === "trending" &&
      selectedFilter.sortDir === "desc"
    ) {
      return "Trending";
    } else if (
      selectedFilter.sortBy === "rating" &&
      selectedFilter.sortDir === "desc"
    ) {
      return "Top-Rated";
    } else if (
      selectedFilter.sortBy === "reviews" &&
      selectedFilter.sortDir === "desc"
    ) {
      return "Most-Reviews";
    } else if (
      selectedFilter.sortBy === "nearest" &&
      selectedFilter.sortDir === "asc"
    ) {
      return "Nearest";
    } else if (
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

  const handleSearchQuery = () => {
    console.log("Search button clicked");
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: searchQuery,
      },
    });
  };

  const [categories, setCategories] = useState(
    router.query.categories ? JSON.parse(router.query.categories) : []
  );
  const [city, setCity] = useState([]);
  const cityOptions = [
    {
      id: 1,
      name: "Jakarta Pusat",
    },
    {
      id: 2,
      name: "Jakarta Timur",
    },
    {
      id: 3,
      name: "Jakarta Selatan",
    },
    {
      id: 4,
      name: "Jakarta Barat",
    },
    {
      id: 5,
      name: "Jakarta Utara",
    },
  ];

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
                      checked={
                        categories.findIndex((c) => c.id === item.id) !== -1
                      }
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

              <div className="px-3 mt-2" style={{ fontSize: "15px" }}>
                <div className="fw-semibold fs-6 mb-2">City</div>
                {cityOptions.map((item, index) => (
                  <div className="">
                    <Input
                      id={item.name}
                      name={item.name}
                      type="checkbox"
                      className="me-2"
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setCity((prev) => [...prev, item]);
                        } else {
                          setCity((prev) =>
                            prev.filter((p) => p.id !== item.id)
                          );
                        }
                      }}
                    ></Input>
                    <Label for={item.name}>{item.name}</Label>
                  </div>
                ))}
              </div>

              <Button
                color="primary"
                className="btn-sm mx-auto mb-2 mt-2"
                style={{ width: "100px" }}
                type="button"
                onClick={() => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      categories:
                        categories.length > 0 ? JSON.stringify(categories) : "",
                      city: city.length > 0 ? JSON.stringify(city) : "",
                    },
                  });
                }}
              >
                Submit
              </Button>
            </div>
          </div>
          <div className="col col-md-10">
            <div className="d-flex py-4 align-items-center justify-content-between">
              <h1 className="">Places Page</h1>
              <div className="d-flex">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="me-3"
                  style={{
                    width: "250px",
                    height: "36px",
                    fontSize: "14px",
                  }}
                  value={searchQuery}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchQuery();
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

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
                          sortBy: "trending",
                          sortDir: "desc",
                        })
                      }
                    >
                      Trending
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        handleFilterSelect({
                          sortBy: "rating",
                          sortDir: "desc",
                        })
                      }
                    >
                      Top-Rated
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        handleFilterSelect({
                          sortBy: "reviews",
                          sortDir: "desc",
                        })
                      }
                    >
                      Most-Reviews
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        handleFilterSelect({
                          sortBy: "nearest",
                          sortDir: "asc",
                        })
                      }
                    >
                      Nearest
                    </DropdownItem>
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
                    <div className="card" style={{ height: "300px" }}>
                      <img
                        src={`http://localhost:8080/${item.fileUrl}`}
                        class="card-img-top object-fit-cover"
                        width={150}
                        height={180}
                        alt=""
                      />
                      <div className="card-body">
                        <h6
                          className="card-title"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 2, // Limit to 2 lines
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </h6>
                        <span className="card-text">
                          <MapPin className="me-1" size={18} />
                          {item.city}
                        </span>
                        <p className="m-0">
                          <Star
                            className="me-1"
                            size={18}
                            color="#ffe234"
                            fill="#ffe234"
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
  console.log("Received query:", query);
  const page = query.page ?? 0;
  const size = query.size ?? 10;
  const sortBy = query.sortBy ?? "createdDate";
  const sortDir = query.sortDir ?? "desc";
  const categories = query.categories ? JSON.parse(query.categories) : null;
  const city = query.city ? JSON.parse(query.city) : null;
  // kenapa title? karena di BE nama key nya title, dan best practice nya kalo bisa samain aja, gak juga gpp sih
  // kenapa null? karena kalo gak ada query nya, gak usah di set -> gak ada means null, undefined, atau empty string ""
  const title = query.search ?? null;

  const response = await fetcher.post(
    `/post/search?sortBy=${sortBy}&sortDir=${sortDir}&page=${page}&size=${size}`,
    {
      ...(categories && { categories: categories }),
      ...(city && { cities: city.map((item) => item.name) }),
      // Ini means kalo title nya ada, baru kita set, kalo gak ada ya gak diset, karena kalo kamu set, ntar BE nya bakal nge filter title nya juga padahal gak perlu
      ...(title && { title: title }),
    }
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
