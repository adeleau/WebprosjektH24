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

    loginButton.simulate("click");
    await new Promise((resolve) => setTimeout(resolve, 0));

    wrapper.update();

    expect(userService.login).toHaveBeenCalledWith("invalidUser", "invalidPass");
    expect(wrapper.find(".error-message").text()).toBe("Invalid Username or Password");
  });

  test("redirects and sets cookie on successful login", async () => {
    const mockUser = { user_id: 1, username: "testuser", email: "test@example.com" };
    
    // Mock userService-metoder
    (userService.login as jest.Mock).mockResolvedValue(true);
    (userService.getByUsername as jest.Mock).mockResolvedValue(mockUser);
  
    // Spioner på Cookies.set
    const setMock = jest.spyOn(Cookies, "set");
  
    const wrapper = mount(
      <Router>
        <Login />
      </Router>
    );
  
    // Simuler brukerinput og innlogging
    wrapper.find("input[type='text']").simulate("change", { target: { value: "testuser" } });
    wrapper.find("input[type='password']").simulate("change", { target: { value: "testpass" } });
    wrapper.find(".login-btn").simulate("click");
  
    // Vent til alle oppdateringer er fullført
    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();
  
    // Bekreft at tjenestekall ble gjort
    expect(userService.login).toHaveBeenCalledWith("testuser", "testpass");
    expect(userService.getByUsername).toHaveBeenCalledWith("testuser");
  
    // Bekreft at Cookies.set ble kalt
    expect(setMock).toHaveBeenCalledWith(
      "user",
      JSON.stringify(mockUser),
      { domain: "localhost" }
    );
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
  
    // Simulerer input
    usernameInput.simulate("change", { target: { value: "invalidUser" } });
    passwordInput.simulate("change", { target: { value: "invalidPass" } });
  
    // Simulerer Enter-tast og venter på oppdatering
    usernameInput.simulate("keydown", { key: "Enter" });
    await new Promise((resolve) => setTimeout(resolve, 0)); // Vent til neste event loop
  
    wrapper.update();
  
    expect(userService.login).toHaveBeenCalledWith("invalidUser", "invalidPass");
    expect(wrapper.find(".error-message").text()).toBe("Invalid Username or Password");
  });
})  