import React from "react";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [params] = useSearchParams();
  const keyword = params.get("q") || "";

  return (
    <div className="search-page py-5">
      <Container>
        <h4 className="fw-bold text-danger mb-4">
          Kết quả tìm kiếm cho: “{keyword}”
        </h4>

        <p className="text-muted">
          (Hiện chưa kết nối backend — sau này sẽ hiển thị danh sách sản phẩm phù hợp)
        </p>
      </Container>
    </div>
  );
}
