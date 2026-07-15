import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { assert, beforeEach } from "vitest";

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod =
    (await vi.importActual) <
    typeof import("react-router-dom") >
    "react-router-dom";
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
  };
});

const testBlogObject = {
  author: "Test Author",
  title: "Test Title",
  url: "Test Url",
  likes: 7357,
  id: "blog_test_id",
  user: {
    username: "testuser",
    name: "Test User",
    id: "user_test_id",
  },
};
const testUserObject = {
  name: "Test User",
  username: "testuser",
};
const otherUserObject = {
  name: "Some Other User",
  username: "otheruser",
};

describe("Blog display to unauthenticated users", () => {
  beforeEach(() => {
    render(<Blog blog={testBlogObject} />);
  });
  test("author, title, url and likes are displayed", () => {
    const urlElement = screen.getByText("Test Url", { exact: false });
    expect(urlElement).toBeVisible();

    const likesElement = screen.getByText("7357", { exact: false });
    expect(likesElement).toBeVisible();

    const authorElement = screen.getByText("Test Author", { exact: false });
    expect(authorElement).toBeVisible();

    const titleElement = screen.getByText("Test Title", { exact: false });
    expect(titleElement).toBeVisible();
  });
  test("like button and delete button are not displayed", () => {
    const like_button = screen.queryByText("like");
    assert.isNull(like_button);

    const delete_button = screen.queryByText(/delete/i);
    assert.isNull(delete_button);
  });
});

describe("Authenticated user who did not create the blog", () => {
  let mockUpdateLike;
  beforeEach(() => {
    mockUpdateLike = vi.fn();
    render(
      <Blog
        blog={testBlogObject}
        user={otherUserObject}
        updateLike={mockUpdateLike}
      />,
    );
  });
  test("like button is displayed", () => {
    const like_button = screen.getByText("like");
    expect(like_button).toBeVisible();
  });

  test("delete button is not displayed", () => {
    const delete_button = screen.queryByText(/delete/i);
    assert.isNull(delete_button);
  });

  test("clicking the like button twice generates two callbacks", async () => {
    const user = userEvent.setup();
    const like_button = screen.getByText("like");

    await user.click(like_button);
    expect(mockUpdateLike.mock.calls).toHaveLength(1);

    await user.click(like_button);
    expect(mockUpdateLike.mock.calls).toHaveLength(2);
  });
});

describe("Authenticated user who created the blog", () => {
  let mockUpdateLike;
  beforeEach(() => {
    mockUpdateLike = vi.fn();
    render(
      <Blog
        blog={testBlogObject}
        user={testUserObject}
        updateLike={mockUpdateLike}
      />,
    );
  });
  test("like button is displayed", () => {
    const like_button = screen.getByText("like");
    expect(like_button).toBeVisible();
  });
  test("delete button is displayed", () => {
    const delete_button = screen.getByText(/delete/i);
    expect(delete_button).toBeVisible();
  });
  test("clicking the like button twice generates two callbacks", async () => {
    const user = userEvent.setup();
    const like_button = screen.getByText("like");

    await user.click(like_button);
    expect(mockUpdateLike.mock.calls).toHaveLength(1);

    await user.click(like_button);
    expect(mockUpdateLike.mock.calls).toHaveLength(2);
  });
});
