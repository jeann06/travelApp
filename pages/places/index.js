import fetcher from "@/utils/fetcher";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { MapPin, Star } from "react-feather";
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
  const { data, content, query } = props;
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const toggleFilter = () => {
    // if (filterOpen === true) {
    //   setFilterOpen(true);
    // } else {
    //   setFilterOpen(false);
    // }
    //ini sama aja logicnya
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
      return "Tanggal Terbaru";
    } else if (
      selectedFilter.sortBy === "createdDate" &&
      selectedFilter.sortDir === "asc"
    ) {
      return "Tanggal Terlama";
    }
  };

  return (
    <div>
      <Container className="align-items-center justify-content-center">
        <div className="row">
          <div className="col-2">
            <span className="fw-bold fs-5">Filtering</span>
            <div className="">
              City
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
          <div className="col">
            <div className="d-flex py-4 align-items-center justify-content-between">
              <h1 className="">Places Page</h1>
              <div className="d-flex">
                <Dropdown
                  className="me-4"
                  isOpen={filterOpen}
                  toggle={toggleFilter}
                >
                  <DropdownToggle caret>
                    {getFilterLabel(selectedFilter)}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() =>
                        handleFilterSelect({
                          sortBy: "createdDate",
                          sortDir: "desc",
                        })
                      }
                    >
                      Tanggal Terbaru
                    </DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        handleFilterSelect({
                          sortBy: "createdDate",
                          sortDir: "asc",
                        })
                      }
                    >
                      Tanggal Terlama
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Button className="" color="primary" href={`places/addPlace`}>
                  Suggest Place
                </Button>
              </div>
            </div>

            {/* <div className="py-2">
          <p>Page: {data.page}</p>
          <p>Total Page: {data.totalPages}</p>
        </div> */}

            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5">
              {content.map((item, index) => (
                <div key={index} className="col mb-4">
                  <Link
                    style={{ textDecoration: "none" }}
                    href={`/places/${item.id}`}
                  >
                    <div className="card">
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
      </Container>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const query = ctx.query;
  const page = query.page ?? 0;
  const size = query.size ?? 5;
  const sortBy = query.sortBy ?? "createdDate";
  const sortDir = query.sortDir ?? "desc";

  const response = await fetcher.post(
    `/post/search?sortBy=${sortBy}&sortDir=${sortDir}&page=${page}&size=${size}`,
    {}
  );

  const data = response.data.data;
  const content = data.content;
  return {
    props: {
      data,
      content,
      query,
    },
  };
}
