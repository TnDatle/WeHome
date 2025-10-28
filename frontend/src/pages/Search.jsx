import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useSearchParams, Link } from "react-router-dom";
import { db } from "../config/Firebase";
import { collection, getDocs } from "firebase/firestore";
import "../style/Search.css";

export default function Search() {
  const [params] = useSearchParams();
  const keyword = (params.get("q") || "").toLowerCase();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);

  // 🔹 Lấy tất cả sản phẩm từ Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "Products"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (err) {
        console.error("🔥 Lỗi khi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Lọc theo từ khóa
  useEffect(() => {
    if (keyword.trim() === "") {
      setFiltered([]);
      return;
    }
    const result = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword) ||
        p.category?.toLowerCase().includes(keyword)
    );
    setFiltered(result);
  }, [keyword, products]);

  return (
    <div className="search-page py-5">
      <Container>
        <h4 className="fw-bold text-danger mb-4">
          Kết quả tìm kiếm cho: “{keyword || " "}”
        </h4>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted text-center">
            Không tìm thấy sản phẩm nào phù hợp với từ khóa “{keyword}”.
          </p>
        ) : (
          <Row className="g-4">
            {filtered.map((item) => (
              <Col key={item.id} xs={6} md={4} lg={3}>
                <Card className="product-card shadow-sm border-0 h-100">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <Card.Img
                      variant="top"
                      src={item.images?.[0] || "/images/no-image.png"}
                      className="product-img"
                    />
                    <Card.Body>
                      <Card.Title className="fs-6 fw-semibold">
                        {item.name}
                      </Card.Title>
                      <Card.Text className="text-danger fw-bold mb-1">
                        {item.price?.toLocaleString("vi-VN")}₫
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        {item.category}
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
