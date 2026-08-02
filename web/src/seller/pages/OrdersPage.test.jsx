import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import OrdersPage from "./OrdersPage";
import client from "../api/client";

jest.mock("../api/client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

const order = {
  _id: "order-12345678",
  status: "PAID",
  allowedTransitions: ["PROCESSED"],
  createdAt: "2026-01-01T00:00:00.000Z",
  shippingAddress: "Jakarta",
  paymentMethod: "Transfer",
  totalPrice: 100000,
  items: [],
};

describe("seller OrdersPage", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders actions from API-provided allowedTransitions", async () => {
    client.get.mockResolvedValue({ data: { data: [order] } });

    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole("button", { name: "Tandai Diproses" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Batalkan" })).not.toBeInTheDocument();
  });

  test("does not infer actions from the current status when the API omits them", async () => {
    client.get.mockResolvedValue({
      data: { data: [{ ...order, allowedTransitions: undefined }] },
    });

    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Pesanan Masuk")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "Tandai Diproses" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Batalkan" })).not.toBeInTheDocument();
  });
});
