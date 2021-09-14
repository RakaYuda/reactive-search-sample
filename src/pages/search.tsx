import { Card, Form, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../hooks/use-debounce";
import { fetchProducts, ProductsState } from "../redux/slices/product-slice";
import { addProductToUserCart, UserState } from "../redux/slices/user-slice";

import { RootState } from "../redux/store";

// const listItem: any = [""];

type Props = {
  products: Product[];
  product: Product | null;
};

type Product = {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
};

interface User {
  username: string;
  name: string;
}

const SearchPage: NextPage = () => {
  const { products, product }: ProductsState = useSelector(
    (state: RootState) => state.products
  );

  const { cart }: UserState = useSelector((state: RootState) => state.user);

  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState<Product[]>([]);

  const searchProductRef = useRef("");

  const debouncedSearchValue = useDebounce(searchString, 500);

  const dispatch = useDispatch();

  const searchItem = (searchValue: any) => {
    const res = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );
    return res;
  };

  const addToCart = (product: Product) => {
    dispatch(addProductToUserCart(product));
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      const search = searchItem(debouncedSearchValue);
      setSearchResult(search);
    } else {
      setSearchResult([]);
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    products.length === 0 && dispatch(fetchProducts());
  }, [dispatch, products]);

  useEffect(() => {
    searchProductRef.current = searchString;
  }, [searchString]);

  return (
    <div className={`container mt-5`}>
      <h1 className={`my-3`}>SearchPage</h1>

      <label htmlFor={"name"} style={{ marginRight: "1rem" }}>
        Products :
      </label>

      {products.length === 0 && <h3>We haven't products here</h3>}

      {products.length > 0 &&
        products.map((product, index) => {
          return (
            <Card className={`my-2 shadow`} key={"product-" + index.toString()}>
              <Card.Body>{product.title}</Card.Body>
            </Card>
          );
        })}

      <Form.Label className={`my-3`}>Search</Form.Label>
      <Form.Control
        placeholder="What you want to search?"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        id="search"
        type="text"
        autoComplete="search"
        required
      />

      {searchResult.length > 0 &&
        searchResult.map((product, index) => {
          return (
            <OverlayTrigger
              key={"ovaerlay-product-" + index.toString()}
              placement={"right"}
              overlay={<Tooltip id={`tooltip-${index}`}>Add to cart.</Tooltip>}
            >
              <Card
                className={`my-2 shadow`}
                key={"temp-product-" + index.toString()}
              >
                <Card.Body
                  className={`d-flex justify-content-between align-middle`}
                >
                  {product.title}
                  <Button
                    variant="outline-primary"
                    onClick={() => addToCart(product)}
                  >
                    +
                  </Button>
                </Card.Body>
              </Card>
            </OverlayTrigger>
          );
        })}

      <label htmlFor={"cart"} className={`my-3`}>
        Cart :
      </label>

      {cart.length > 0 &&
        cart.map((product, index) => {
          return (
            <Card
              className={`my-2 shadow`}
              key={"cart-product-" + index.toString()}
            >
              <Card.Body>{product.title}</Card.Body>
            </Card>
          );
        })}
    </div>
  );
};

export default SearchPage;
