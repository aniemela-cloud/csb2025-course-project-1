import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlog from "./NewBlog";

const test_authorName = "Test Author";
const test_blogTitle = "Test Title";
const test_url = "http://test.it/testing";

test("Callback function called with correct parameters when new blog entry posted", async () => {
  const mockNewBlog = vi.fn();
  render(<NewBlog newBlog={mockNewBlog} />);

  const authorField = screen.getByLabelText("author", { exact: false });
  const titleField = screen.getByLabelText("blog title", { exact: false });
  const urlField = screen.getByLabelText("URL", { exact: false });

  const submitButton = screen.getByText("Add Blog");
  const user = userEvent.setup();

  await user.type(authorField, test_authorName);
  await user.type(titleField, test_blogTitle);
  await user.type(urlField, test_url);

  await user.click(submitButton);

  expect(mockNewBlog.mock.calls).toHaveLength(1);
  expect(mockNewBlog.mock.calls[0][0].author).toBe(test_authorName);
  expect(mockNewBlog.mock.calls[0][0].title).toBe(test_blogTitle);
  expect(mockNewBlog.mock.calls[0][0].url).toBe(test_url);
});
