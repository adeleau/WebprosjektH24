import * as React from "react";
import { mount } from "enzyme";
import { MemoryRouter as Router } from "react-router-dom";
import { Login } from "../../src/components/login-components";
import userService from "../../src/services/user-service";
import Cookies from "js-cookie";

jest.mock("../../src/services/user-service");
jest.mock("js-cookie");

describe("Login Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Login component correctly", () => {
    const wrapper = mount(
      <Router>
        <Login />
      </Router>
    );

    expect(wrapper.find("h1").at(0).text()).toBe("Sign In");
    expect(wrapper.find("h1").at(1).text()).toBe("Log in");
    expect(wrapper.find("input[type='text']").exists()).toBe(true);
    expect(wrapper.find("input[type='password']").exists()).toBe(true);
    expect(wrapper.find(".login-btn").text()).toBe("Login");
  });

  test("shows error message on invalid credentials", async () => {
    (userService.login as jest.Mock).mockResolvedValue(false);

    const wrapper = mount(
      <Router>
        <Login />
      </Router>
    );

    const usernameInput = wrapper.find("input[type='text']");
    const passwordInput = wrapper.find("input[type='password']");
    const loginButton = wrapper.find(".login-btn");

    usernameInput.simulate("change", { target: { value: "invalidUser" } });
    passwordInput.simulate("change", { target: { value: "invalidPass" } });

    await loginButton.simulate("click");

    wrapper.update();

    expect(userService.login).toHaveBeenCalledWith("invalidUser", "invalidPass");
    expect(wrapper.find(".error-message").text()).toBe("Invalid Username or Password");
  });

  test("redirects and sets cookie on successful login", async () => {
    const mockUser = { user_id: 1, username: "testuser", email: "test@example.com" };
    (userService.login as jest.Mock).mockResolvedValue(true);
    (userService.getByUsername as jest.Mock).mockResolvedValue(mockUser);
    const setMock = jest.spyOn(Cookies, "set");

    const wrapper = mount(
      <Router>
        <Login />
      </Router>
    );

    const usernameInput = wrapper.find("input[type='text']");
    const passwordInput = wrapper.find("input[type='password']");
    const loginButton = wrapper.find(".login-btn");

    usernameInput.simulate("change", { target: { value: "testuser" } });
    passwordInput.simulate("change", { target: { value: "testpass" } });

    await loginButton.simulate("click");

    wrapper.update();

    expect(userService.login).toHaveBeenCalledWith("testuser", "testpass");
    expect(userService.getByUsername).toHaveBeenCalledWith("testuser");
    expect(setMock).toHaveBeenCalledWith("user", JSON.stringify(mockUser), { domain: "localhost" });
  });

  test("handles Enter key for login", async () => {
    (userService.login as jest.Mock).mockResolvedValue(false);

    const wrapper = mount(
      <Router>
        <Login />
      </Router>
    );

    const usernameInput = wrapper.find("input[type='text']");
    const passwordInput = wrapper.find("input[type='password']");

    usernameInput.simulate("change", { target: { value: "invalidUser" } });
    passwordInput.simulate("change", { target: { value: "invalidPass" } });

    await usernameInput.simulate("keydown", { key: "Enter" });

    wrapper.update();

    expect(userService.login).toHaveBeenCalledWith("invalidUser", "invalidPass");
    expect(wrapper.find(".error-message").text()).toBe("Invalid Username or Password");
  });
});
