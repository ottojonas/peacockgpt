import axios from "axios";
import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../pages/register";
import Login from "../pages/login";

jest.mock("axios");

describe("Auth Tests", () => {
  it("should register a new user", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: { message: "user registered successfully" },
    });

    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("register"));

    expect(
      await screen.findByText("user registered successfully")
    ).toBeInTheDocument();
  });

  it("should login with registered user", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: { message: "login successful" },
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("login"));

    expect(await screen.findByText("login successful")).toBeInTheDocument();
  });
});
